// Pruebas dirigidas y tentativa continua. Requiere Chrome instalado, no dependencias nuevas.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const out = path.join(root, '.sdd/evidence');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const report = { errors: [], checks: {}, localTrials: [] };
const forms = process.argv.includes('--super-only') ? ['super'] : ['small', 'super'];
const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--config', 'vite/config.dev.mjs', '--port', '8092', '--strictPort'], { cwd: root, stdio: 'ignore' });
let chrome;
let ws;

(async () =>
{
    for (let attempt = 0; attempt < 50; attempt++)
    {
        try { if ((await fetch('http://localhost:8092/')).ok) break; } catch {}
        await sleep(200);
    }
    chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
        '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
        '--window-size=1024,768', '--remote-debugging-port=9244',
        'http://localhost:8092/'
    ], { stdio: 'ignore' });
    let url;
    for (let attempt = 0; attempt < 50 && !url; attempt++)
    {
        try
        {
            const targets = await (await fetch('http://127.0.0.1:9244/json/list')).json();
            url = targets.find((target) => target.type === 'page')?.webSocketDebuggerUrl;
        }
        catch {}
        if (!url) await sleep(200);
    }
    ws = new WebSocket(url);
    await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
    let id = 0;
    const pending = new Map();
    ws.onmessage = ({ data }) =>
    {
        const message = JSON.parse(data);
        if (message.id)
        {
            const callbacks = pending.get(message.id);
            pending.delete(message.id);
            if (message.error) callbacks.reject(new Error(JSON.stringify(message.error)));
            else callbacks.resolve(message.result);
        }
        if (message.method === 'Runtime.exceptionThrown') report.errors.push(message.params.exceptionDetails);
        if (message.method === 'Log.entryAdded' && message.params.entry.level === 'error') report.errors.push(message.params.entry.text);
    };
    const send = (method, params = {}) => new Promise((resolve, reject) =>
    {
        const requestId = ++id;
        pending.set(requestId, { resolve, reject });
        ws.send(JSON.stringify({ id: requestId, method, params }));
    });
    const evaluate = async (expression) =>
    {
        const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
        return result.result.value;
    };
    const shot = async (name) =>
    {
        const { data } = await send('Page.captureScreenshot', { format: 'png' });
        fs.writeFileSync(path.join(out, name), Buffer.from(data, 'base64'));
    };
    const waitFor = async (expression) =>
    {
        for (let attempt = 0; attempt < 60; attempt++)
        {
            if (await evaluate(expression)) return;
            await sleep(100);
        }
        throw new Error('Timeout: ' + expression);
    };
    const loadGame = async () =>
    {
        await send('Page.navigate', { url: 'http://localhost:8092/' });
        await sleep(1800);
        await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
        await sleep(80);
        await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
        await sleep(2300);
        const proto = await send('Runtime.evaluate', { expression: "import('/src/game/entities/Mario.js').then((module) => module.Mario.prototype)", awaitPromise: true });
        const instances = await send('Runtime.queryObjects', { prototypeObjectId: proto.result.objectId });
        await send('Runtime.callFunctionOn', { objectId: instances.objects.objectId, functionDeclaration: 'function () { window.__testGame = this.find((m) => m.active && m.scene)?.scene.game; }' });
        await waitFor("window.__testGame?.scene.isActive('Game')");
    };
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Log.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 768, deviceScaleFactor: 1, mobile: false });
    await loadGame();

    report.checks.assembly = await evaluate(`(() => {
        const scene = window.__testGame.scene.getScene('Game');
        const images = scene.children.list.filter((object) => object.type === 'Image' && object.texture.key === 'tiles');
        const frame = (x,y) => images.find((object) => object.x === x && object.y === y)?.frame.name;
        return {
            surface: [frame(9,261), frame(27,261), frame(45,261)],
            base: [frame(9,279), frame(27,279), frame(45,279)],
            red: [frame(873,207),frame(891,207),frame(909,207),frame(927,207)],
            beige: [frame(297,207),frame(315,207),frame(333,207),frame(351,207)],
            firstCloud: images.filter((object) => object.depth === -1 && object.y === 63 && object.x >=144 && object.x <=198).map((object) => object.frame.name)
        };
    })()`);
    assert.deepEqual(report.checks.assembly.surface, [21,22,22]);
    assert.deepEqual(report.checks.assembly.base, [141,142,142]);
    assert.deepEqual(report.checks.assembly.red, [14,12,13,15]);
    assert.deepEqual(report.checks.assembly.beige, [41,42,42,43]);
    assert.deepEqual(report.checks.assembly.firstCloud, [153,154,155]);
    await shot('016-ensamblado.png');

    // Fixture local: sin contactos de enemigos/coleccionables/meta salvo monedas.
    const setupLocal = `(() => {
        const scene = window.__testGame.scene.getScene('Game');
        const mario = scene.children.list.find((object) => object.form === 'small');
        scene.physics.world.colliders.getActive().filter((collider) => collider.overlapOnly
            && collider.object2.texture?.key !== 'tiles').forEach((collider) => collider.active = false);
        scene.children.list.filter((object) => object.body?.physicsType === 0 && object !== mario)
            .forEach((object) => object.body.enable = false);
        window.__localTrial = async ({x, jumpDelay=100, right=true, jump=true, duration=750}) => {
            const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
            const key = (type, code, keyCode, key) => window.dispatchEvent(new KeyboardEvent(type, {code,key,keyCode,which:keyCode,bubbles:true}));
            mario.body.reset(x,252);
            await delay(150);
            const initialCoins = scene.registry.get('gameState').coins;
            let minFeet = mario.y, maxX = mario.x, ceilingHit = false, frames = 0;
            const sample = () => { minFeet=Math.min(minFeet,mario.y);maxX=Math.max(maxX,mario.x);ceilingHit ||= mario.body.blocked.up;frames++; };
            scene.events.on('postupdate',sample);
            if(right)key('keydown','ArrowRight',39,'ArrowRight');
            await delay(jumpDelay);
            if(jump){key('keydown','Space',32,' ');await delay(80);key('keyup','Space',32,' ');}
            await delay(duration);
            key('keyup','ArrowRight',39,'ArrowRight');
            scene.events.off('postupdate',sample);
            return {form:mario.form,initialX:x,finalX:mario.x,finalFeet:mario.y,maxRise:252-minFeet,maxX,ceilingHit,frames,
                coins:scene.registry.get('gameState').coins-initialCoins,lives:scene.registry.get('gameState').lives};
        };
    })()`;
    await evaluate(setupLocal);
    for (const form of forms)
    {
        if (form === 'super')
        {
            await loadGame();
            await evaluate(setupLocal);
            await evaluate("window.__testGame.scene.getScene('Game').children.list.find((object) => object.form === 'small').grow()");
        }
        for (const fixture of [
            { name:'free-jump', x:2800, right:false },
            { name:'reported-pipe', x:950, duration:1000 },
            { name:'red-platform-48', x:834, duration:600 },
            { name:'red-platform-130', x:2310, duration:600 },
            { name:'wood-platform', x:274, jumpDelay:0, duration:750 },
            { name:'pipe-30', x:510, duration:1000 },
            { name:'pipe-100', x:1770, duration:1000 },
            { name:'pipe-150', x:2670, duration:1000 },
            { name:'pit-68', x:1195, jumpDelay:200, duration:1000 },
            { name:'pit-116', x:2059, jumpDelay:200, duration:1000 },
            { name:'pit-164', x:2923, jumpDelay:200, duration:1000 }
        ])
        {
            const result = await evaluate(`window.__localTrial(${JSON.stringify(fixture)})`);
            report.localTrials.push({ name: fixture.name, ...result });
            assert.ok(result.frames > 0, fixture.name + ': no frames');
            assert.equal(result.lives, 3, fixture.name + ': fixture died');
            if (fixture.name === 'reported-pipe')
            {
                assert.ok(result.finalX > 1009, 'No cruza tubería reportada');
                assert.equal(result.ceilingHit, false);
                assert.ok(result.maxRise > 60);
                await shot('017-paso-' + form + '.png');
            }
            if (fixture.name.includes('platform')) assert.equal(result.finalFeet, 198, fixture.name);
            if (fixture.name.startsWith('pipe-')) assert.ok(result.finalX > fixture.x + 48, fixture.name);
            if (fixture.name.startsWith('pit-')) assert.ok(result.finalX > fixture.x + 65, fixture.name);
            if (fixture.name === 'red-platform-130')
            {
                assert.ok(result.coins >= 3, 'Monedas sobre plataforma roja: ' + form);
                await shot('017-plataforma-' + form + '.png');
            }
        }
    }
    await evaluate("window.__testGame.scene.getScene('Game').children.list.find((object) => object.form === 'super').body.reset(950,252)");
    await sleep(1200);
    await shot('016-tramo-corregido.png');
    report.result = 'local-passed';

    if (process.argv.includes('--continuous'))
    {
        report.continuous = [];
        for (const form of forms)
        {
            await loadGame();
            if (form === 'super') await evaluate("window.__testGame.scene.getScene('Game').children.list.find((object) => object.form === 'small').grow()");
            await evaluate(`(() => {
                window.__chunks = [];
                window.__recorder = new MediaRecorder(document.querySelector('canvas').captureStream(12));
                window.__recorder.ondataavailable = (event) => window.__chunks.push(event.data);
                window.__recorder.start();
            })()`);
            report.continuous.push(await evaluate(`(${continuousRun.toString()})()`));
            await shot('017-recorrido-' + form + '.png');
            const video = await evaluate(`new Promise((resolve) => {
                window.__recorder.onstop = () => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result.split(',')[1]);
                    reader.readAsDataURL(new Blob(window.__chunks, {type:window.__recorder.mimeType}));
                };
                window.__recorder.stop();
            })`);
            fs.writeFileSync(path.join(out, '017-recorrido-' + form + '.webm'), Buffer.from(video, 'base64'));
        }
    }
})().catch((error) =>
{
    report.result = 'failed';
    report.failure = error.stack;
    process.exitCode = 1;
}).finally(() =>
{
    const name = process.argv.includes('--super-only') ? '017-verificacion-super.json' : '017-verificacion.json';
    fs.writeFileSync(path.join(out, name), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    ws?.close();
    chrome?.kill();
    vite.kill();
});

async function continuousRun ()
{
    const game = window.__testGame;
    const scene = game.scene.getScene('Game');
    const mario = scene.children.list.find((object) => object.form === 'small' || object.form === 'super');
    const level = (await import('/src/game/level/world11.js')).WORLD_1_1;
    const start = performance.now();
    const initialLives = game.registry.get('gameState').lives;
    const initialForm = mario.form;
    const damageEvents = [];
    const damaged = (payload) => damageEvents.push({fatal:payload.fatal,x:mario.x,ms:Math.round(performance.now()-start)});
    mario.on('mario:damaged',damaged);
    const key = (type, code, keyCode, key) => window.dispatchEvent(new KeyboardEvent(type, {code,key,keyCode,which:keyCode,bubbles:true}));
    let rightHeld = false, jumpHeld = false, lastJump = -1000;
    const plantStates = new Map();
    const checkpoints = [];
    let nextCheckpoint = 400;
    let result = 'timeout';
    let lastX = mario.x, lastProgress = start;
    while (performance.now() - start < 90000)
    {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const now = performance.now();
        if (game.scene.isActive('LevelComplete')) { result = 'completed'; break; }
        if (damageEvents.length) { result = 'damage-taken'; break; }
        if (game.registry.get('gameState').lives !== initialLives) { result = 'life-lost'; break; }
        if (Math.abs(mario.x-lastX)>2) { lastX=mario.x;lastProgress=now; }
        if (now-lastProgress>12000) { result='stalled';break; }
        if (mario.x >= nextCheckpoint) { checkpoints.push({x:mario.x,ms:Math.round(now-start),form:mario.form});nextCheckpoint+=400; }
        let move = true;
        let jump = false;
        const grounded = mario.body.blocked.down || mario.body.touching.down;
        const plants = scene.children.list.filter((object) => object.texture?.key?.startsWith('piranha_'));
        for (const plant of plants)
        {
            const state = plantStates.get(plant) || {enabled:true,hiddenSince:0};
            if (!plant.body.enable && state.enabled) state.hiddenSince=now;
            state.enabled=plant.body.enable;
            plantStates.set(plant,state);
            const distance = plant.x-mario.x;
            if (distance>35 && distance<65 && grounded && (state.enabled || now-state.hiddenSince>900)) move=false;
        }
        if (grounded)
        {
            // Despegar antes de entrar bajo la plataforma, no reaccionar al enemigo ya bajo el techo.
            for (const platform of level.platforms)
            {
                const distance = platform.left-mario.x;
                if (distance>0 && distance<18 && mario.body.bottom>platform.top) jump=true;
            }
            for (const pipe of level.pipes)
            {
                const distance=pipe.x-mario.x;
                if (move && distance>0 && distance<41) jump=true;
            }
            for (let i=0;i<level.ground.length-1;i++)
            {
                const edge=level.ground[i].to;
                if (mario.x>=edge-20 && mario.x<edge+10) jump=true;
            }
            const goombas=scene.children.list.filter((object) => typeof object.isSquashed==='boolean' && object.active && !object.isSquashed);
            for(const goomba of goombas)
            {
                const distance=goomba.x-mario.x;
                if(distance>-10 && distance<40 && Math.abs(goomba.y-mario.y)<30) jump=true;
            }
        }
        if (move !== rightHeld) { key(move?'keydown':'keyup','ArrowRight',39,'ArrowRight');rightHeld=move; }
        if (jumpHeld && now-lastJump>80) { key('keyup','Space',32,' ');jumpHeld=false; }
        if (jump && grounded && !jumpHeld && now-lastJump>400)
        {
            key('keydown','Space',32,' ');jumpHeld=true;lastJump=now;
        }
    }
    key('keyup','ArrowRight',39,'ArrowRight');key('keyup','Space',32,' ');
    mario.off('mario:damaged',damaged);
    return {result,initialX:54,initialForm,finalForm:mario.form,lastX:mario.x,elapsedMs:Math.round(performance.now()-start),lives:game.registry.get('gameState').lives,damageEvents,checkpoints,
        physicsFps:scene.physics.world?.fps,renderFps:Math.round(game.loop.actualFps),
        method:'Continuo desde spawn normal, teclado sintético, enemigos activos, sin reposicionar ni conceder invulnerabilidad; termina al recibir daño. Super se prepara con grow() solo en el spawn.'};
}
