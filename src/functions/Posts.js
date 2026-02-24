const api = "https://dummyjson.com/"

export async function getAllProducts(){

    try{

        const res = await fetch(api+"products")
        const data = await res.json();
        return data.products
    }catch(error){
        console.log(error)
    }

}

export  async function filterProd(text) {
    try{
        const product = await getAllProducts();
        const search = product.filter((p)=> p.tilte === text)
        return search
    }catch(error){
        console.log(error)
    }
}