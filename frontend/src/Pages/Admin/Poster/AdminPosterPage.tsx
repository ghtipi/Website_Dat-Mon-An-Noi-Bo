import { useState, useEffect, useCallback } from 'react';
import LayoutAdmin from '../../../components/Layout/LayoutAdmin';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import posterService, { Poster } from '../../../services/admin/poster';
import CreatePoster from '../../../components/Admin/Poster/CreatePoster';
import EditPoster from '../../../components/Admin/Poster/EditPoster';

const AdminPosterPage = () => {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [posterToDelete, setPosterToDelete] = useState<{ id: string; title: string } | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Poster; direction: 'asc' | 'desc' } | null>(null);
  const token = localStorage.getItem('token') || '';

  const fetchPosters = useCallback(async () => {
    try {
      setLoading(true);
      const data = await posterService.getPosters(token);
      // Validate poster IDs and check for duplicates
      const validPosters = data.filter((poster) => {
        if (!poster.id) {
          console.warn('Poster with missing ID:', poster);
          return false;
        }
        return true;
      });
      const ids = validPosters.map((poster) => poster.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        console.warn('Duplicate poster IDs detected:', ids);
      }
      setPosters(validPosters);
      setError(null);
    } catch (err: any) {
      const errorMessage =
        err.message === 'Authentication token is required'
          ? 'Vui lòng đăng nhập lại.'
          : err.response?.status === 403
          ? 'Không có quyền: Yêu cầu quyền admin.'
          : err.message || 'Lấy danh sách poster thất bại';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPosters();
  }, [fetchPosters]);

  const handleSort = (key: keyof Poster) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' };
      }
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
    });
  };

  const sortedPosters = [...posters].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleDeleteClick = (id: string, title: string) => {
    setPosterToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await posterService.deletePoster(token, id);
      setPosters(posters.filter((poster) => poster.id !== id));
      setDeleteModalOpen(false);
      toast.success('Xóa poster thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (err: any) {
      const errorMessage =
        err.message === 'Authentication token is required'
          ? 'Vui lòng đăng nhập lại.'
          : err.response?.status === 403
          ? 'Không có quyền: Yêu cầu quyền admin.'
          : err.message || 'Xóa poster thất bại';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  const handleStatusToggle = async (poster: Poster) => {
    if (!poster.id) {
      console.error('Cannot toggle status: Poster ID is missing', poster);
      toast.error('Lỗi: Poster không có ID hợp lệ', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      return;
    }

    try {
      const updatedStatus = poster.status === 'active' ? 'inactive' : 'active';
      const updatedPoster = await posterService.updatePoster(token, poster.id, { status: updatedStatus });
      setPosters(posters.map((p) => (p.id === poster.id ? updatedPoster : p)));
      toast.success('Cập nhật trạng thái thành công!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    } catch (err: any) {
      const errorMessage =
        err.message === 'Authentication token is required'
          ? 'Vui lòng đăng nhập lại.'
          : err.response?.status === 403
          ? 'Không có quyền: Yêu cầu quyền admin.'
          : err.message || 'Cập nhật trạng thái thất bại';
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  const handleCreateSuccess = (newPoster: Poster) => {
    setPosters([...posters, newPoster]);
    setShowCreateModal(false);
  };

  const handleUpdateSuccess = (updatedPoster: Poster) => {
    setPosters(posters.map((poster) => (poster.id === updatedPoster.id ? updatedPoster : poster)));
    setEditingPoster(null);
  };

  const handleEditClick = (poster: Poster) => {
    setEditingPoster(poster);
  };

  if (loading && posters.length === 0) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="text-lg text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  if (error) {
    return (
      <LayoutAdmin>
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-6 rounded-xl shadow-lg max-w-md flex items-center gap-3">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 001.06 1.02L10 11.59l1.72 1.72a.75.75 0 001.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
            <div>{error}</div>
          </div>
        </div>
      </LayoutAdmin>
    );
  }

  return (
    <LayoutAdmin>
      <div className="container mx-auto px-4 sm:px-4 lg:px-6 lg:py-8 py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Quản lý Poster</h1>
            <p className="mt-1 text-sm text-gray-500">Quản lý và theo dõi các poster trong hệ thống</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm Poster Mới
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('image')}
                  >
                    Hình Ảnh {sortConfig?.key === 'image' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('title')}
                  >
                    Tiêu Đề {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Mô Tả
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('position')}
                  >
                    Vị Trí {sortConfig?.key === 'position' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    Trạng Thái {sortConfig?.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('created_at')}
                  >
                    Ngày Tạo {sortConfig?.key === 'created_at' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedPosters.length === 0 ? (
                  <tr key="empty-state">
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-base font-medium">Không có poster nào</p>
                        <p className="text-sm text-gray-500">Hãy thêm poster mới để bắt đầu</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedPosters.map((poster, index) => {
                    
                    return (
                      <tr key={poster.id || `poster-${index}`} className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-4 py-3 whitespace-nowrap">
                          {poster.image && (
                            <img
                              src={poster.image}
                              alt={poster.title}
                              className="h-12 w-12 rounded-lg object-cover border border-gray-200 shadow-sm"
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{poster.title}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-900 line-clamp-2">
                            {poster.description || 'Không có mô tả'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{poster.position ?? '0'}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleStatusToggle(poster)}
                            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              poster.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                                poster.status === 'active' ? 'translate-x-5' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(poster.created_at).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleEditClick(poster)}
                              className="text-indigo-600 hover:text-indigo-800 transition-all duration-200 font-semibold flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteClick(poster.id, poster.title)}
                              className="text-red-600 hover:text-red-800 transition-all duration-200 font-semibold flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {deleteModalOpen && posterToDelete && (
          <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-center w-10 h-10 mx-auto bg-red-100 rounded-full">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center">
                  <h3 className="text-base font-semibold text-gray-900">Xác nhận xóa poster</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Bạn có chắc chắn muốn xóa poster{' '}
                      <span className="font-medium">{posterToDelete.title}</span> không?
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-5">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex justify-center rounded-md bg-red-600 text-white text-sm font-medium px-4 py-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                  onClick={() => handleDelete(posterToDelete.id)}
                >
                  Xóa
                </button>
                <button
                  type="button"
                  className="mt-2 sm:mt-0 sm:mr-3 w-full sm:w-auto inline-flex justify-center rounded-md bg-white text-gray-700 text-sm font-medium px-4 py-2 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <CreatePoster
            token={token}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateModal(false)}
          />
        )}

        {editingPoster && (
          <EditPoster
            token={token}
            poster={editingPoster}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setEditingPoster(null)}
          />
        )}
      </div>
    </LayoutAdmin>
  );
};

export default AdminPosterPage;