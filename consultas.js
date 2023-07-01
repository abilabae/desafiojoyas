const express= require('express')
const pool =require('./conexiones')
const format= require('pg-format')

//Consulta de joyas
const getInventario=async({limits=3, page=1, order_by="stock_ASC"})=>{
    const[campo, direccion]= order_by.split("_")
    const offset=(page -1)* limits
    
    const {rows:joyas}= await pool.query(
        format(
            "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
             campo,
             direccion,
             limits,
             offset)
    );
    return joyas
}

//funcion HATEOAS

const funcionHATEOAS= (joyas)=>{
    const results= joyas.map((j)=>{
        return {
            name: j.nombre,
            stock:j.stock,
            href: `/joyas/joya/${j.id}`,
        }
    })
 
const total= joyas.length
const HATEOAS={
    total,
    page,
    results
}
return HATEOAS
}

//Link HATEOAS
const getJoya= async(id)=>{
    const {rows}=await pool.query("SELECT * FROM inventario WHERE id=$1", [id])
    return rows[0]
}

//Consulta con filtros
const joyasFiltro= async (querystring)=>{
    let filtros=[]
    let values=[]

    const agregarFiltro= (campo, comparador,valor)=>{
        values.push(valor);
        const {length}=filtros
        filtros.push(`${campo} ${comparador} $${length+1}`)
    }

    const {precio_max, precio_min, categoria, metal}= querystring

    if(precio_max) agregarFiltro('precio', '<=', precio_max)
    if(precio_min) agregarFiltro('precio', '>=', precio_min)
    if(categoria) agregarFiltro('categoria', 'ilike', `%${categoria}`)
    if(metal) agregarFiltro('metal', 'ilike', `%${metal}`)

    let consulta="SELECT * FROM inventario"
    if(filtros.length>0) {
        consulta+= " WHERE " + filtros.join(" AND ")
    }

    const {rows: joyas}= await pool.query(consulta, values)
    return joyas

}


module.exports={
    getInventario,
    funcionHATEOAS,
    getJoya,
    joyasFiltro
}