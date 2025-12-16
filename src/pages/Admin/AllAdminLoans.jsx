import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;
const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

export default function AllAdminLoans() {
  const loadedLoans = useLoaderData();
  const [loans, setLoans] = useState(loadedLoans);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loadedLoans) {
      setLoading(false);
    }
  }, [loadedLoans]);

  const filteredLoans = loans.filter((loan) => {
    const matchSearch = loan.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter
      ? loan.category === categoryFilter
      : true;
    return matchSearch && matchCategory;
  });

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const openUpdateModal = (loan) => {
    setSelectedLoan(loan);
    setImagePreview(loan.image);
    const modal = document.getElementById("updateModal");
    modal.showModal();
    setTimeout(() => modal.querySelector("input")?.focus(), 50);
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`;

    const res = await fetch(url, { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      setImagePreview(data.data.url);
      setSelectedLoan({ ...selectedLoan, image: data.data.url });
    }

    setUploadingImage(false);
  };

  // UPDATE LOAN FUNCTION (PATCH)
  const handleUpdateLoan = async (e) => {
    e.preventDefault();
    try {
      // Only send the fields that exist in DB
      const updateData = {
        title: selectedLoan.title,
        category: selectedLoan.category,
        interest: Number(selectedLoan.interest),
        maxLoanLimit: selectedLoan.maxLoanLimit,
        image: selectedLoan.image,
      };

      const res = await fetch(`${API}/loans/${selectedLoan._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Failed to update loan");

      setLoans((prev) =>
        prev.map((l) =>
          l._id === selectedLoan._id ? { ...l, ...updateData } : l
        )
      );

      Swal.fire("Updated!", "Loan updated successfully.", "success");

      const modal = document.getElementById("updateModal");
      modal.close();
      setSelectedLoan(null);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleToggleHome = async (loan) => {
    const updatedValue = !loan.showHome;
    const res = await fetch(`${API}/loans/home/${loan._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showHome: updatedValue }),
    });

    if (res.ok) {
      setLoans((prev) =>
        prev.map((l) =>
          l._id === loan._id ? { ...l, showHome: updatedValue } : l
        )
      );
    }
  };

  const handleDelete = (loanId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This loan will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(`${API}/loans/${loanId}`, { method: "DELETE" });
        setLoans((prev) => prev.filter((l) => l._id !== loanId));
        Swal.fire("Deleted!", "Loan has been removed.", "success");
      }
    });
  };

  return (
    <section className="py-10 px-6">
      <motion.div
        className="max-w-7xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="font-rajdhani text-3xl font-bold mb-2">
            All <span className="text-gradient">Loans</span>
          </h2>
          <p className="text-gray-600">Check, update, and delete all loans</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center gap-3">
            <span className="loading loading-spinner loading-xl text-info"></span>
            <h3 className="text-gradient text-xl font-bold">
              All Loans added by Managers are Loading . . .
            </h3>
          </div>
        ) : (
          <>
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
              <input
                type="text"
                placeholder="Search loans..."
                className="input input-bordered w-full md:w-1/3"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="select select-bordered w-full md:w-1/4"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {[...new Set(loans.map((l) => l.category))].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-base-300 shadow-md rounded-xl">
              <table className="table table-zebra">
                <thead className="bg-green-300 text-green-800">
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Interest</th>
                    <th>Category</th>
                    <th>Created By</th>
                    <th>Home</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredLoans.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-6">
                        No loans found for this filter.
                      </td>
                    </tr>
                  )}

                  {filteredLoans.map((loan) => (
                    <tr
                      key={loan._id}
                      className="hover:bg-base-300 transition-all duration-200 cursor-pointer"
                    >
                      <td>
                        <img
                          src={loan.image}
                          className="w-20 h-14 object-cover rounded"
                        />
                      </td>
                      <td>{loan.title}</td>
                      <td>{loan.interest}%</td>
                      <td>
                        <span className="badge badge-info">
                          {loan.category}
                        </span>
                      </td>
                      <td>{loan.createdBy}</td>
                      <td>
                        <input
                          type="checkbox"
                          className="toggle toggle-success"
                          checked={loan.showHome}
                          onChange={() => handleToggleHome(loan)}
                        />
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => openUpdateModal(loan)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-sm btn-error"
                            onClick={() => handleDelete(loan._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Update Modal */}
            <dialog id="updateModal" className="modal">
              <div className="modal-box w-11/12 max-w-3xl">
                <h3 className="font-bold text-center font-rajdhani text-gradient text-2xl mb-4">
                  Update Loan
                </h3>

                {selectedLoan && (
                  <form onSubmit={handleUpdateLoan} className="space-y-4">
                    <label className="font-semibold">Title</label>
                    <input
                      type="text"
                      value={selectedLoan.title}
                      onChange={(e) =>
                        setSelectedLoan({
                          ...selectedLoan,
                          title: e.target.value,
                        })
                      }
                      className="input input-bordered w-full mt-2"
                      placeholder="Loan Title"
                    />

                    <label className="font-semibold">Category</label>
                    <input
                      type="text"
                      value={selectedLoan.category}
                      onChange={(e) =>
                        setSelectedLoan({
                          ...selectedLoan,
                          category: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                      placeholder="Category"
                    />

                    <label className="font-semibold">Interest</label>
                    <input
                      type="number"
                      value={selectedLoan.interest}
                      onChange={(e) =>
                        setSelectedLoan({
                          ...selectedLoan,
                          interest: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                      placeholder="Interest %"
                    />

                    <label className="font-semibold">Max Loan Limit</label>
                    <input
                      type="text"
                      value={selectedLoan.maxLoanLimit}
                      onChange={(e) =>
                        setSelectedLoan({
                          ...selectedLoan,
                          maxLoanLimit: e.target.value,
                        })
                      }
                      className="input input-bordered w-full"
                      placeholder="Max Loan Limit"
                    />

                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="font-semibold">Loan Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="file-input w-full"
                          onChange={handleImageUpload}
                        />
                        {uploadingImage && (
                          <p className="text-sm text-blue-500 mt-1">
                            Uploading image...
                          </p>
                        )}
                      </div>
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          className="w-32 h-20 rounded-md object-cover"
                        />
                      )}
                    </div>

                    <button type="submit" className="btn bg-gradient w-full">
                      Save Changes
                    </button>
                  </form>
                )}

                <div className="modal-action">
                  <button
                    onClick={() =>
                      document.getElementById("updateModal").close()
                    }
                    className="btn btn-outline"
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          </>
        )}
      </motion.div>
    </section>
  );
}
