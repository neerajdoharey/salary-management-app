import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { employeesApi } from '../api/client';
import {
  Search,
  Filter,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  X,
  AlertCircle,
  Building2,
  DollarSign,
  Mail,
  User,
  Users,
  Briefcase,
  Globe,
  Plus,
  CheckCircle2,
} from 'lucide-react';

export default function EmployeesPage() {
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(location.state?.successMessage || null);

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);
      // Clean up window history state to prevent showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);

  // Selection & Details Modal
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch employees list
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page,
        per_page: perPage,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (department) params.department = department;
      if (country) params.country = country;

      const data = await employeesApi.list(params);
      setEmployees(data.employees || []);
      setMeta(
        data.meta || {
          current_page: 1,
          total_pages: 1,
          total_count: 0,
        }
      );
    } catch (err) {
      console.error('Failed to load employees:', err);
      setError(
        err.response?.data?.error ||
        'Unable to load employees. Please check that the Rails API is online.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, searchQuery, department, country]);

  // Load on mount and when filter criteria change
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Debounced search reset to page 1
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setPage(1);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDepartment('');
    setCountry('');
    setPage(1);
  };

  // Delete employee
  const handleDeleteEmployee = async (id) => {
    setIsDeleting(true);
    try {
      await employeesApi.delete(id);
      setDeleteConfirmationId(null);
      if (selectedEmployee?.id === id) setSelectedEmployee(null);
      await fetchEmployees();
    } catch (err) {
      console.error('Delete employee error:', err);
      alert('Failed to delete employee: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for varied avatar colors matching table_list.html
  const getAvatarColor = (id) => {
    const colors = [
      'bg-indigo-600',
      'bg-blue-600',
      'bg-emerald-600',
      'bg-pink-600',
      'bg-purple-600',
      'bg-amber-600',
      'bg-cyan-600',
      'bg-rose-600',
    ];
    return colors[Math.abs(Number(id) || 0) % colors.length];
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'EM';
  };

  // Department Badge Colors
  const getDeptBadgeClass = (dept) => {
    switch (dept) {
      case 'Engineering':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Product':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Sales':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Marketing':
        return 'bg-pink-50 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300 border-pink-200 dark:border-pink-800';
      case 'Finance':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Human Resources':
        return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Operations':
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  // Pagination calculation
  const fromRecord = meta.total_count === 0 ? 0 : (meta.current_page - 1) * perPage + 1;
  const toRecord = Math.min(meta.current_page * perPage, meta.total_count);

  return (
    <div className="space-y-6">
      {/* Table Container Card matching table_list.html */}
      <div className="mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {/* Table Header Controls */}
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Employee Directory
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {meta.total_count.toLocaleString()} Total Records
            </span>
          </div>

          {/* Search & Filter Controls matching table_list.html */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto flex-wrap">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search name, email, role..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors placeholder-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setPage(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Department Dropdown Filter */}
            <select
              value={department}
              onChange={handleDepartmentChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Operations">Operations</option>
              <option value="Legal">Legal</option>
            </select>

            {/* Country Dropdown Filter */}
            <select
              value={country}
              onChange={handleCountryChange}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-colors"
            >
              <option value="">All Countries</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Australia">Australia</option>
              <option value="Canada">Canada</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Japan">Japan</option>
              <option value="India">India</option>
              <option value="Brazil">Brazil</option>
              <option value="Singapore">Singapore</option>
            </select>

            {/* Reset / Refresh Button */}
            {(searchQuery || department || country) && (
              <button
                onClick={handleResetFilters}
                className="flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Reset all filters"
              >
                Reset
              </button>
            )}

            <button
              onClick={fetchEmployees}
              disabled={isLoading}
              className="flex items-center justify-center p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh employee data"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Add New Employee Link/Button */}
            <Link
              to="/admin/employees/new"
              id="add-new-employee-button"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Employee</span>
            </Link>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-200 p-1"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mx-4 sm:mx-6 mt-4 p-4 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* The Data Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Employee ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Employee
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Job Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Country
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Annual Salary
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading && employees.length === 0 ? (
                // Skeleton loading rows
                [...Array(6)].map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                        <div className="space-y-1.5">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                          <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : employees.length === 0 ? (
                // Empty State
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-400 flex items-center justify-center mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        No employees found
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                        No employee records matched your active filters or search query.
                      </p>
                      {(searchQuery || department || country) && (
                        <button
                          onClick={handleResetFilters}
                          className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                // Active Rows matching table_list.html layout
                employees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    {/* Employee ID */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white font-mono">
                      EMP-{emp.id}
                    </td>

                    {/* Employee Avatar, Name, Email */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-10 w-10 ${getAvatarColor(
                            emp.id
                          )} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-xs`}
                        >
                          {getInitials(emp.first_name, emp.last_name)}
                        </div>
                        <div className="ml-3.5">
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">
                            {emp.first_name} {emp.last_name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {emp.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {emp.job_title || 'Employee'}
                    </td>

                    {/* Department Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border ${getDeptBadgeClass(
                          emp.department
                        )}`}
                      >
                        {emp.department || 'General'}
                      </span>
                    </td>

                    {/* Country */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {emp.country || 'Global'}
                    </td>

                    {/* Annual Salary */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      ${Number(emp.salary || 0).toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </td>

                    {/* Action Buttons matching table_list.html trash & view */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* View Details Button */}
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="View Profile Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Delete Trash Icon Button */}
                        <button
                          onClick={() => setDeleteConfirmationId(emp.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer matching table_list.html */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{fromRecord}</span> to{' '}
            <span className="font-semibold text-gray-900 dark:text-white">{toRecord}</span> of{' '}
            <span className="font-semibold text-gray-900 dark:text-white">
              {meta.total_count.toLocaleString()}
            </span>{' '}
            records
          </div>

          <div className="flex items-center space-x-3">
            {/* Rows Per Page Selector */}
            <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span>Per page:</span>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage(1)}
                disabled={page <= 1 || isLoading}
                className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>

              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1 || isLoading}
                className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="px-3 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200">
                Page {meta.current_page} of {meta.total_pages || 1}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(p + 1, meta.total_pages))}
                disabled={page >= meta.total_pages || isLoading}
                className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={() => setPage(meta.total_pages)}
                disabled={page >= meta.total_pages || isLoading}
                className="p-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Employee Profile Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`h-12 w-12 rounded-full ${getAvatarColor(
                    selectedEmployee.id
                  )} text-white font-bold text-base flex items-center justify-center shadow-xs`}
                >
                  {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedEmployee.first_name} {selectedEmployee.last_name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ID: EMP-{selectedEmployee.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold">
                    <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                    <span>Job Title</span>
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.job_title}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold">
                    <Building2 className="h-3.5 w-3.5 text-purple-500" />
                    <span>Department</span>
                  </div>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${getDeptBadgeClass(
                        selectedEmployee.department
                      )}`}
                    >
                      {selectedEmployee.department}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold">
                    <Globe className="h-3.5 w-3.5 text-blue-500" />
                    <span>Location</span>
                  </div>
                  <div className="mt-1 font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.country}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Annual Salary</span>
                  </div>
                  <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 font-mono text-base">
                    ${Number(selectedEmployee.salary || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 uppercase font-semibold">
                  <Mail className="h-3.5 w-3.5 text-gray-500" />
                  <span>Work Email</span>
                </div>
                <div className="mt-1 font-mono text-gray-800 dark:text-gray-200 text-xs">
                  {selectedEmployee.email}
                </div>
              </div>

              <div className="text-xs text-gray-400 flex items-center justify-between pt-2">
                <span>Record Created: {new Date(selectedEmployee.created_at).toLocaleDateString()}</span>
                <span>Tenancy: Organization #{selectedEmployee.organization_id}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-sm p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 mx-auto flex items-center justify-center mb-3">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Delete Employee Record?
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
              Are you sure you want to delete employee record{' '}
              <strong>EMP-{deleteConfirmationId}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmationId(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteEmployee(deleteConfirmationId)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
