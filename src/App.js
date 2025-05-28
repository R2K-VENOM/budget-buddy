import './App.css';
import { useEffect, useState } from "react";
import shortid from 'shortid';

function App() {
  const [name, setName] = useState("");
  const [datetime, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransaction().then(setTransactions);
  }, []);

  async function getTransaction() {
    const url = process.env.REACT_APP_API_URL + "/transactions";
    const response = await fetch(url);
    return await response.json();
  }

  async function deleteTransaction(id) {
  const url = process.env.REACT_APP_API_URL + "/transaction/" + id;
  const response = await fetch(url, { method: "DELETE" });
  if (response.ok) {
    getTransaction().then(setTransactions);
  }
}

  function handleSubmit(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = parseFloat(name.split(" ")[0]);
    const actualName = name.substring(name.indexOf(" ") + 1);

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: actualName,
        description,
        datetime,
        price
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setName("");
        setDate("");
        setDescription("");
        getTransaction().then(setTransactions);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }

  return (
    <>
      <main>

        <h1>฿udge£ ฿udd¥</h1>
        <h2>Total Available balance ₨: <span className="green">{balance}</span></h2>
        <form onSubmit={handleSubmit}>
          <div className="basic">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Add expense"
            />
            <input
              type="date"
              onChange={e => setDate(e.target.value)}
              value={datetime}
            />
          </div>

          <div className="description">
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <button class="Btn">
            ADD TRANSACTION
            <svg class="svgIcon" viewBox="0 0 576 512"><path d="M512 80c8.8 0 16 7.2 16 16v32H48V96c0-8.8 7.2-16 16-16H512zm16 144V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V224H528zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24h48c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24H360c13.3 0 24-10.7 24-24s-10.7-24-24-24H248z"></path></svg>
          </button>
        </form>

        <div className="transactions-container">
          <div className="transactions">
            {transactions.length > 0 && transactions.map(transaction => (
              <div className="transaction" key={shortid.generate()}>
                <div className="left">
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </div>
                <div className="right">
                  <div className="price">₹{transaction.price}</div>
                  <div className="datetime">{transaction.datetime}</div>
                  <button title="Delete transaction" onClick={() => deleteTransaction(transaction._id)}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>

  );
}

export default App;