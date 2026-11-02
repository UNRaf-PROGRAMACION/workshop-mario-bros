/** Selecciona por topología, nunca por la posición incidental en el atlas. */
export const tileForColumn = (family, index, columns) =>
{
    if (!Number.isInteger(columns) || columns < 1
        || !Number.isInteger(index) || index < 0 || index >= columns)
    {
        throw new Error(`Columna inválida: ${index} de ${columns}`);
    }

    if (columns === 1)
    {
        if (!family.single)
        {
            throw new Error('La familia no tiene tile aislado; necesita al menos dos columnas');
        }

        return family.single;
    }

    if (index === 0)
    {
        return family.left;
    }

    if (index === columns - 1)
    {
        return family.right;
    }

    return family.centers[(index - 1) % family.centers.length];
};
