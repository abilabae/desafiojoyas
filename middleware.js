const mostrarConsulta=(req, res, next)=>{
    const url=req.url
    const method= req.method
    console.log(`Hoy ${new Date()} se ha realizado la consulta por ${url} y por el metodo ${method}`)
    next ()
}

module.exports= mostrarConsulta