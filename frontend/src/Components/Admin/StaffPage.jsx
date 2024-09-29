import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import logo from '../../assets/logo.PNG'; // Adjust the path to your logo image

const StaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await axios.get('/api/staff');
      setStaff(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/staff/search?name=${searchTerm}`);
      setStaff(response.data);
    } catch (error) {
      console.error('Error searching staff:', error);
    }
  };

  const handleEditClick = (staffMember) => {
    navigate('/staff/create', { state: { editMode: true, staffToEdit: staffMember } });
  };

  const handleDeleteClick = async (staffId) => {
    try {
      await axios.delete(`/api/staff/${staffId}`);
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff member:', error);
    }
  };


const generatePDF = () => {
    const doc = new jsPDF();

    // Add the logo to the PDF
    const img = new Image();
    img.src = logo; // Use the imported image

    img.onload = () => {
        // Add the image when it's loaded (Base64 format is supported directly in jsPDF)
        doc.addImage(img, 'PNG', 10, 10, 40, 10); // Adjust the X, Y, width, and height as needed

        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('Staff List', 105, 30, null, null, 'center');

        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const headers = ['NIC', 'Name', 'Email', 'Birthday', 'Phone'];
        const data = staff.map(staffMember => [
            staffMember.nic,
            staffMember.name,
            staffMember.email,
            staffMember.birthday.split('T')[0], // Remove time portion of birthday
            staffMember.phone
        ]);

        const columnWidths = [28, 45, 60, 24, 30]; // Adjusted column widths for better spacing
        let yPosition = 45; // Adjusted for the logo

        // Draw Headers
        headers.forEach((header, i) => {
            doc.setFont('helvetica', 'bold');
            doc.text(header, 20 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), yPosition); // Dynamically calculate position based on column widths
        });

        doc.line(20, yPosition + 2, 190, yPosition + 2);
        yPosition += 8;

        // Draw Rows
        data.forEach((row) => {
            let rowHeight = 0; // Track the height for this row

            // Check for page overflow
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }

            row.forEach((text, i) => {
                doc.setFont('helvetica', 'normal');

                // Split text into lines that fit within the column width
                const lines = doc.splitTextToSize(String(text), columnWidths[i]);

                // Render each line
                lines.forEach((line, j) => {
                    doc.text(line, 20 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), yPosition + (j * 6));
                });

                // Calculate the row height based on the number of lines for the current cell
                rowHeight = Math.max(rowHeight, lines.length * 6);
            });

            yPosition += rowHeight; // Move to the next row
        });

        // Footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Generated on: ' + new Date().toLocaleString(), 20, yPosition + 10);

        doc.save('staff-list.pdf');
    };
};

  
return (
  <div className="p-6 min-h-screen bg-[radial-gradient(100%_50%_at_50%_0%,#b8f724_0,#faffe5_50%,rgba(0,163,255,0)_100%)]">
    <h2 className="text-xl font-bold mb-4">Staff Members</h2>

    {/* Search Bar and Buttons */}
    <div className="mb-4 flex justify-between items-center space-x-4"> 
      <button
        onClick={() => navigate('create')}
        className="bg-lime-500 text-white px-3 py-1 rounded-full shadow hover:bg-green-600 transition duration-300"
      >
        Add Staff
      </button>

      <div className="relative w-full max-w-md"> {/* Centered Search Bar */}
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
          <th className="p-3 text-left">NIC</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Birthday</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {staff.length > 0 ? (
          staff.map((staffMember) => (
            <tr key={staffMember._id} className="border-t border-lime-500">
              <td className="p-3">{staffMember.nic}</td>
              <td className="p-3">{staffMember.name}</td>
              <td className="p-3">{staffMember.email}</td>
              <td className="p-3">{staffMember.birthday.split('T')[0]}</td>
              <td className="p-3">{staffMember.phone}</td>
              <td className="p-3 flex items-center space-x-2">
                <button
                  onClick={() => handleEditClick(staffMember)}
                  className="bg-green-500 text-white px-3 py-1 rounded-full mr-2 shadow hover:bg-green-600 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(staffMember._id)}
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
            <td colSpan="6" className="p-3 text-center">No staff members found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);




};

export default StaffPage