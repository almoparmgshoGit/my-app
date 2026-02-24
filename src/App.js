import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllProducts } from './functions/Posts'

function App() {
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [value, setValue] = useState('');
  const [sorted, setSorted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })
  const [modelCart, setModelCart] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getAllProducts()
      setProducts(data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const filteredProducts = useMemo(() =>
    products.filter(p =>
      p.title.toLowerCase().includes(value.toLowerCase())
    )
    , [products, value])

  const addCart = useCallback((id) => {
    const exist = cart.find(f => f.id === id)
    if (exist) return
    const product = products.find(p => p.id === id)
    if (product) setCart(prev => [...prev, product])
  }, [products, cart])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const sortedProducts = sorted
    ? [...filteredProducts].sort((a, b) => a.price - b.price)
    : filteredProducts

  const totaleCart = cart.reduce((acc, cartitem) => acc + cartitem.price, 0);

  // if (loading) return <h2 style={{color:"#fff"}}>جاري التحميل... ⏳</h2>
  return (

    <div style={{ background: "#333", transition: 'ease-in', justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      {loading && <h2 style={{ color: "#fff" }}>جاري التحميل... ⏳</h2>}
      <div style={{ left: "490px", gap:"10px", top: "10px", position: "absolute" }}>
        <input type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder='بحث ' style={{ width: "450px", padding: '10px' }} />
        <button style={{padding:"10px"}} onClick={(e) => setSorted(!sorted)}>{sorted ? "الارخص" : "الاصلي"}</button>
        <h3 onClick={() => setModelCart(true)} style={{ color: "#fff" }}>Cart {cart.length}</h3>
      </div>

      {sortedProducts.map((p) => (
        <>
          <div key={p.id}>
            <img src={p.thumbnail} alt={p.title} />
            <h1>{p.title}</h1>
            <p>{p.price}</p>
            <button onClick={() => setSelectedProduct(p.id)}>QR</button>
            {!cart.find((item) => item.id === p.id) ? (
              <button onClick={() => addCart(p.id)}>Add</button>
            ) : "موجود"}
          </div>
          {selectedProduct === p.id &&
            <div>
              <button onClick={() => setSelectedProduct(null)}>✕ اغلق</button>
              <img src={p.meta.qrCode} alt="" />
            </div>
          }



        </>

      ))}
      {modelCart && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{ background: "#fff", padding: 40 }}>
            <button onClick={() => setModelCart(false)}>✕</button>

            <ul>
              {cart.map(item => (
                <li key={item.id}>
                  {item.title} | {item.price}
                </li>
              ))}
            </ul>
            Totle : {totaleCart}$ {  " "}
          <button onClick={()=> setCart([])}>حذف الكل </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App