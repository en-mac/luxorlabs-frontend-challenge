import { useState } from 'react';

export default function CollectionForm({ onSubmit, initialData }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [stocks, setStocks] = useState(initialData?.stocks || 0);
  const [price, setPrice] = useState(initialData?.price || 0.0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, description, stocks, price });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <input type="number" value={stocks} onChange={(e) => setStocks(Number(e.target.value))} placeholder="Stocks" />
      <input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Price" />
      <button type="submit">Submit</button>
    </form>
  );
}
