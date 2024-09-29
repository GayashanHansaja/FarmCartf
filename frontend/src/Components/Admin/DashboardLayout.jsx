import React, { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { FiUser, FiUsers, FiTag, FiBarChart2 } from 'react-icons/fi'; // Example icons
import logo from '../../assets/logo.PNG'; // Adjust the path to your logo

const DashboardLayout = () => {
  const [customerCount, setCustomerCount] = useState(0);
  
  const [staffCount, setStaffCount] = useState(0);

  useEffect(() => {
    // Fetch customer count
    const fetchCustomerCount = async () => {
      try {
        const response = await axios.get('/api/customer/count'); // Adjust the endpoint as per your backend
        setCustomerCount(response.data.count);
      } catch (error) {
        console.error('Error fetching customer count:', error);
      }
    };
    const fetchStaffCount = async () => {
      try {
        const response = await axios.get('/api/staff/count'); // Adjust the endpoint as per your backend
        setStaffCount(response.data.count);
      } catch (error) {
        console.error('Error fetching customer count:', error);
      }
    };
    fetchStaffCount();
    fetchCustomerCount();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg pl-6 pt-16 border-r border-gray-200">
        <img src={logo} alt="Logo" className="w-40 mb-10" /> {/* Updated logo here */}
        <nav className="space-y-4">
          <ul className="space-y-4">
            <li>
              <Link
                to="/Admindashboard/customer"
                className="flex items-center text-lg text-gray-800 hover:text-[#99DD05] transition duration-200"
              >
                <FiUser className="mr-2" /> Customer
              </Link>
            </li>
            <li>
              <Link
                to="/Admindashboard/staff"
                className="flex items-center text-lg text-gray-800 hover:text-[#99DD05] transition duration-200"
              >
                <FiUsers className="mr-2" /> Staff
              </Link>
            </li>
            <li>
              <Link
                to="/Admindashboard/offers"
                className="flex items-center text-lg text-gray-800 hover:text-[#99DD05] transition duration-200"
              >
                <FiTag className="mr-2" /> Offers
              </Link>
            </li>
            <li>
              <Link
                to="/Admindashboard/financial-analysis"
                className="flex items-center text-lg text-gray-800 hover:text-[#99DD05] transition duration-200"
              >
                <FiBarChart2 className="mr-2" /> Financial Analysis
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-10 bg-gradient-to-r from-[#e2f0cb] to-[#fafff5] text-black overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold text-gray-700">Dashboard</h1>
          <p className="text-gray-500">Welcome back, Admin!</p>
        </header>

        {/* Analytics and Quick Actions Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Analytics Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-[#99DD05]">
            <h2 className="text-lg font-medium text-gray-600">Total Customers</h2>
            <p className="text-3xl font-bold text-gray-900">{customerCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-[#99DD05]">
            <h2 className="text-lg font-medium text-gray-600">Total Staff</h2>
            <p className="text-3xl font-bold text-gray-900">{staffCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 border-l-4 border-[#99DD05]">
            <h2 className="text-lg font-medium text-gray-600">Total Revenue</h2>
            <p className="text-3xl font-bold text-gray-900">$45,780</p>
          </div>
        </section>

        {/* Recent Activity and Table Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <ul className="space-y-3">
              <li className="flex justify-between text-gray-600">
                <span>New customer signed up</span>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Order #1245 placed</span>
                <span className="text-sm text-gray-400">4 hours ago</span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Product promotion updated</span>
                <span className="text-sm text-gray-400">6 hours ago</span>
              </li>
              <li className="flex justify-between text-gray-600">
                <span>Staff member added</span>
                <span className="text-sm text-gray-400">8 hours ago</span>
              </li>
            </ul>
          </div>

          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Customers</h2>
            <table className="min-w-full bg-white">
              <thead className="bg-[#99DD05] text-white">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-100 transition duration-200">
                  <td className="p-3 text-gray-600">John Doe</td>
                  <td className="p-3 text-gray-600">john@example.com</td>
                  <td className="p-3 text-gray-600">123-456-7890</td>
                  <td className="p-3 flex space-x-2">
                    <button className="bg-[#99DD05] text-white px-3 py-1 rounded hover:bg-green-700 transition duration-200">
                      View
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200">
                      Delete
                    </button>
                  </td>
                </tr>
                {/* Add more rows */}
              </tbody>
            </table>
          </div>
        </section>

        {/* Render nested routes or content */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
