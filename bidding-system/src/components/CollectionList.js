import { useState, useEffect } from 'react';
import CollectionForm from './CollectionForm';
import BidForm from './BidForm';

export default function CollectionList() {
  const [collections, setCollections] = useState([]);
  const [showCollectionForm, setShowCollectionForm] = useState(false);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [isEditingBid, setIsEditingBid] = useState(null);

  useEffect(() => {
    fetch('/api/collections')
      .then(res => res.json())
      .then(data => setCollections(data));
  }, []);

  const handleCollectionFormSubmit = async (formData) => {
    const res = await fetch('/api/collections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const newCollection = await res.json();
    setCollections([...collections, newCollection]);
    setShowCollectionForm(false);
  };

  const handleBidFormSubmit = async (collectionId, formData) => {
    const res = await fetch(`/api/collections/${collectionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const newBid = await res.json();
    setCollections(collections.map(collection =>
      collection.id === collectionId
        ? { ...collection, bids: [...(collection.bids || []), newBid] }
        : collection
    ));
  };

  const fetchBids = async (collectionId) => {
    const res = await fetch(`/api/collections/${collectionId}`);
    const data = await res.json();
    setCollections(collections.map(collection =>
      collection.id === collectionId
        ? { ...collection, bids: data }
        : collection
    ));
  };

  const deleteCollection = async (collectionId) => {
    await fetch(`/api/collections/${collectionId}`, {
      method: 'DELETE',
    });
    setCollections(collections.filter(collection => collection.id !== collectionId));
  };

  const deleteBid = async (bidId) => {
    await fetch(`/api/bids/${bidId}`, {
      method: 'DELETE',
    });
    setCollections(collections.map(collection => ({
      ...collection,
      bids: collection.bids ? collection.bids.filter(bid => bid.id !== bidId) : [],
    })));
  };

  const acceptBid = async (collectionId, bidId) => {
    const res = await fetch('/api/bids/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionId, bidId }),
    });

    if (res.ok) {
      const updatedBid = await res.json();
      setCollections(collections.map(collection => 
        collection.id === collectionId
          ? {
              ...collection,
              bids: collection.bids.map(bid => 
                bid.id === bidId
                  ? updatedBid
                  : { ...bid, status: 'rejected' }
              ),
            }
          : collection
      ));
    }
  };

  const updateCollection = async (collectionId, formData) => {
    const res = await fetch(`/api/collections/${collectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const updatedCollection = await res.json();
    setCollections(collections.map(collection =>
      collection.id === collectionId ? updatedCollection : collection
    ));
    setIsEditingCollection(false);
  };

  const updateBid = async (bidId, formData) => {
    const res = await fetch(`/api/bids/${bidId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const updatedBid = await res.json();
    setCollections(collections.map(collection =>
      ({
        ...collection,
        bids: collection.bids ? collection.bids.map(bid =>
          bid.id === bidId ? updatedBid : bid
        ) : [],
      })
    ));
    setIsEditingBid(null);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Collections</h1>
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowCollectionForm(true)}
      >
        Add Collection
      </button>
      {showCollectionForm && <CollectionForm onSubmit={handleCollectionFormSubmit} />}
      {collections.map(collection => (
        <div key={collection.id} className="border rounded-lg p-4 mb-4">
          <h3 className="text-xl font-bold">{collection.name}</h3>
          <p>{collection.description}</p>
          <p>Stocks: {collection.stocks}</p>
          <p>Price: ${collection.price}</p>
          <div className="flex space-x-2 mt-2">
            <button 
              className="bg-green-500 text-white px-2 py-1 rounded"
              onClick={() => {
                setCurrentCollection(collection.id);
                fetchBids(collection.id);
              }}
            >
              Add Bid
            </button>
            <button 
              className="bg-yellow-500 text-white px-2 py-1 rounded"
              onClick={() => {
                setIsEditingCollection(true);
                setCurrentCollection(collection.id);
              }}
            >
              Edit Collection
            </button>
            <button 
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => deleteCollection(collection.id)}
            >
              Delete Collection
            </button>
          </div>
          {isEditingCollection && currentCollection === collection.id && (
            <CollectionForm
              onSubmit={(formData) => updateCollection(collection.id, formData)}
              initialData={{
                name: collection.name,
                description: collection.description,
                stocks: collection.stocks,
                price: collection.price,
              }}
            />
          )}
          {currentCollection === collection.id && (
            <BidForm onSubmit={(formData) => handleBidFormSubmit(collection.id, formData)} />
          )}
          <h4 className="mt-4 mb-2 text-lg font-semibold">Bids</h4>
          {collection.bids && collection.bids.map(bid => (
            <div key={bid.id} className="border rounded p-2 mb-2">
              <p>Bid by User {bid.userId}: ${bid.price}</p>
              <p>Status: {bid.status}</p>
              <div className="flex space-x-2 mt-2">
                <button 
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => deleteBid(bid.id)}
                >
                  Delete Bid
                </button>
                <button 
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => acceptBid(collection.id, bid.id)}
                >
                  Accept Bid
                </button>
                <button 
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => setIsEditingBid(bid.id)}
                >
                  Edit Bid
                </button>
              </div>
              {isEditingBid === bid.id && (
                <BidForm
                  onSubmit={(formData) => updateBid(bid.id, formData)}
                  initialData={{
                    price: bid.price,
                    status: bid.status,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
