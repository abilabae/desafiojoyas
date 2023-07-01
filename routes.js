const express=require('express')

const router= express.Router();

const{getInventario, funcionHATEOAS, getJoya, joyasFiltro}=require('./consultas')
const mostrarConsulta= require('./middleware')


router.get('/', mostrarConsulta, (req,res)=>{
    res.send('Servidor en Express desde routes')
})

router.get('/joyas', mostrarConsulta, async(req,res)=>{
    try {
        const consultas= req.query
        page= +req.query.page || 1
        const joyas= await getInventario(consultas)
        const HATEOAS= funcionHATEOAS(joyas, page)
        res.json(HATEOAS)
    } catch (error) {
        res.status(500).send(error)
    }

})

router.get('/joyas/joya/:id', mostrarConsulta, async (req,res)=>{
    try {
        const id= req.params.id
        const joyas=await getJoya(id)
        res.json(joyas)
    } catch (error) {
        res.status(500).send(error)
        
    }
})

router.get('/joyas/filtros', mostrarConsulta, async (req, res)=>{
    try {
        const consultas=req.query
        const joyas= await joyasFiltro(consultas)
        res.json(joyas)
    } catch (error) {
        res.status(500).send(error)
        
    }
})

module.exports=router