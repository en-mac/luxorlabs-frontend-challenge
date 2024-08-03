import { useState } from 'react';

export default function BidForm({ onSubmit, initialData }) {
  const [price, setPrice] = useState(initialData?.price || 0.0);
  const [userName, setUserName] = useState(initialData?.userName || '');
  const [userEmail, setUserEmail] = useState(initialData?.userEmail || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName || !userEmail || !price) {
      alert('User name, email, and price are required');
      return;
    }
    onSubmit({ price, userName, userEmail });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Bid Price" required />
      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User Name" required />
      <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="User Email" required />
      <button type="submit">Submit</button>
    </form>
  );
}
