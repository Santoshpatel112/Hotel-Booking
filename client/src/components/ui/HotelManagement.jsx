import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Plus, Search, Edit, Trash2, MapPin, Users, X, Save } from 'lucide-react';
import { hotelAPI, roomAPI } from '../../services/api';

const HotelManagement = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await hotelAPI.getAllHotels();
      setHotels(response.data || []);
    } catch (err) {
      setError('Failed to fetch hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setFormData(item || { name: '', city: '', cheapestPrice: 0 });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setSelectedItem(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (modalType === 'add-hotel') {
        await hotelAPI.createHotel(formData);
      } else if (modalType === 'edit-hotel') {
        await hotelAPI.updateHotel(selectedItem._id, formData);
      }
      fetchHotels();
      closeModal();
    } catch (err) {
      setError('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      setLoading(true);
      await hotelAPI.deleteHotel(id);
      fetchHotels();
    } catch (err) {
      setError('Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const filteredHotels = hotels.filter(hotel =>
    hotel.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>Property Management</h2>
        <button
          onClick={() => openModal('add-hotel')}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          <Plus size={16} className='inline mr-2' />
          Add Hotel
        </button>
      </div>

      <div className='relative max-w-md'>
        <Search size={16} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          placeholder='Search hotels...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10 pr-4 py-2 w-full border rounded-lg'
        />
      </div>

      <div className='bg-white rounded-xl border shadow-sm overflow-hidden'>
        {loading ? (
          <div className='p-12 text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p>Loading...</p>
          </div>
        ) : error ? (
          <div className='p-12 text-center'>
            <p className='text-red-500 mb-4'>{error}</p>
            <button onClick={fetchHotels} className='px-4 py-2 bg-blue-600 text-white rounded-lg'>
              Retry
            </button>
          </div>
        ) : (
          <table className='min-w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left'>Hotel</th>
                <th className='px-6 py-3 text-left'>Location</th>
                <th className='px-6 py-3 text-left'>Price</th>
                <th className='px-6 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHotels.map((hotel) => (
                <tr key={hotel._id} className='border-t hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center'>
                      <img
                        className='h-10 w-10 rounded-lg object-cover mr-4'
                        src={hotel.photos?.[0] || '/placeholder.jpg'}
                        alt={hotel.name}
                      />
                      <div>
                        <div className='font-medium'>{hotel.name}</div>
                        <div className='text-sm text-gray-500'>{hotel.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center'>
                      <MapPin size={14} className='mr-1 text-gray-400' />
                      {hotel.city}
                    </div>
                  </td>
                  <td className='px-6 py-4'>₹{hotel.cheapestPrice || 0}</td>
                  <td className='px-6 py-4 text-right'>
                    <button
                      onClick={() => openModal('edit-hotel', hotel)}
                      className='text-blue-600 hover:text-blue-900 mr-2'
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel._id)}
                      className='text-red-600 hover:text-red-900'
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-white rounded-lg shadow-xl max-w-md w-full'
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className='flex justify-between items-center p-6 border-b'>
                <h3 className='text-lg font-semibold'>
                  {modalType === 'edit-hotel' ? 'Edit' : 'Add'} Hotel
                </h3>
                <button onClick={closeModal} className='text-gray-400'>
                  <X size={20} />
                </button>
              </div>

              <div className='p-6 space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-2'>Hotel Name</label>
                  <input
                    type='text'
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className='w-full px-3 py-2 border rounded-lg'
                    placeholder='Enter hotel name'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>City</label>
                  <input
                    type='text'
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className='w-full px-3 py-2 border rounded-lg'
                    placeholder='Enter city'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium mb-2'>Price (₹)</label>
                  <input
                    type='number'
                    value={formData.cheapestPrice || ''}
                    onChange={(e) => setFormData({ ...formData, cheapestPrice: Number(e.target.value) })}
                    className='w-full px-3 py-2 border rounded-lg'
                    placeholder='0'
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-3 p-6 border-t'>
                <button
                  onClick={closeModal}
                  className='px-4 py-2 border rounded-lg hover:bg-gray-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                >
                  <Save size={16} className='inline mr-2' />
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HotelManagement;