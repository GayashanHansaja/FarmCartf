import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.PNG'; // Adjust the path to your logo image

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customer');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/customer/search?name=${searchTerm}`);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error searching customers:', error);
    }
  };

  const handleEditClick = (customer) => {
    navigate('/customer/create', { state: { editMode: true, customerToEdit: customer } });
  };

  const handleDeleteClick = async (customerId) => {
    try {
      await axios.delete(`/api/customer/${customerId}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 40, 10);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Customer List', 105, 30, null, null, 'center');

      doc.setLineWidth(0.5);
      doc.line(20, 35, 190, 35);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const headers = ['Name', 'Email', 'Phone'];
      const data = customers.map(customer => [
        customer.name,
        customer.email,
        customer.phone
      ]);

      const columnWidths = [60, 60, 40]; // Adjusted column widths
      let yPosition = 45;

      headers.forEach((header, i) => {
        doc.setFont('helvetica', 'bold');
        doc.text(header, 20 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), yPosition);
      });

      doc.line(20, yPosition + 2, 190, yPosition + 2);
      yPosition += 8;

      data.forEach((row) => {
        let rowHeight = 0;

        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        row.forEach((text, i) => {
          doc.setFont('helvetica', 'normal');
          const lines = doc.splitTextToSize(String(text), columnWidths[i]);
          lines.forEach((line, j) => {
            doc.text(line, 20 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), yPosition + (j * 6));
          });
          rowHeight = Math.max(rowHeight, lines.length * 6);
        });

        yPosition += rowHeight;
      });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text('Generated on: ' + new Date().toLocaleString(), 20, yPosition + 10);

      doc.save('customer-list.pdf');
    };
  };

  return (
    <div className="p-6 min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,#b8f724_0,#faffe5_50%,rgba(0,163,255,0)_100%)]">
      <h2 className="text-xl font-bold mb-4">Customers</h2>

      {/* Search Bar and Buttons */}
      <div className="mb-4 flex justify-between items-center space-x-4">
        <button
          onClick={() => navigate('create')}
          className="bg-lime-500 text-white px-3 py-1 rounded-full shadow hover:bg-green-600 transition duration-300"
        >
          Add Customer
        </button>

        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
            className="border border-gray-300 rounded-full p-2 pl-4 pr-10 w-full shadow-sm focus:ring focus:ring-lime-500 focus:outline-none transition-all duration-300 ease-in-out"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 border border-lime-500 text-black px-4 py-1 rounded-full shadow hover:bg-lime-500 hover:text-white transition duration-300"
          >
            Search
          </button>
        </div>

        <button
          onClick={generatePDF}
          className="bg-lime-500 text-white px-3 py-1 rounded-full shadow hover:bg-green-500 transition duration-300"
        >
          Download PDF
        </button>
      </div>

      <table className="w-full bg-white shadow-md rounded mb-4 border-2 border-lime-500">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer._id} className="border-t border-lime-500">
                <td className="p-3">{customer.name}</td>
                <td className="p-3">{customer.email}</td>
                <td className="p-3">{customer.phone}</td>
                <td className="p-3 flex items-center space-x-2">
                  <button
                    onClick={() => handleEditClick(customer)}
                    className="bg-green-500 text-white px-3 py-1 rounded-full mr-2 shadow hover:bg-green-600 transition duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(customer._id)}
                    className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition duration-300"
                    aria-label="Delete"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerPage;
