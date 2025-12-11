import { useLoaderData } from "react-router";
import Swal from "sweetalert2";
import { useState } from "react";

export default function AllLoans() {
  const API = import.meta.env.VITE_API_URL;
  const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

  /* ------------------------------
      LOADED LOANS
  ------------------------------ */
  const loadedLoans = useLoaderData();
  const [loans, setLoans] = useState(loadedLoans);

  /* ------------------------------
      SEARCH & FILTERS
  ------------------------------ */
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filteredLoans = loans.filter((loan) => {
    const matchSearch = loan.title.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter
      ? loan.category === categoryFilter
      : true;

    return matchSearch && matchCategory;
  });

  /* ------------------------------
      UPDATE MODAL STATE
  ------------------------------ */
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const openUpdateModal = (loan) => {
    setSelectedLoan(loan);
    setImagePreview(loan.image);
    document.getElementById("updateModal").showModal();
  };

  /* ------------------------------
      IMAGE UPLOAD TO IMGBB
  ------------------------------ */
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);

    const formData = new FormData();
    formData.append("image", file);

    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`;

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      setImagePreview(data.data.url);
      setSelectedLoan({ ...selectedLoan, image: data.data.url });
    }

    setUploadingImage(false);
  };

  /* ------------------------------
      UPDATE LOAN
  ------------------------------ */
  const handleUpdateLoan = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/loans/${selectedLoan._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedLoan),
      });

      if (!res.ok) throw new Error("Failed to update loan");

      // Update UI instantly
      setLoans((prev) =>
        prev.map((l) => (l._id === selectedLoan._id ? selectedLoan : l))
      );

      Swal.fire("Updated!", "Loan updated successfully.", "success");

      document.getElementById("updateModal").close();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  /* ------------------------------
      TOGGLE SHOW HOME
  ------------------------------ */
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

  /* ------------------------------
      DELETE LOAN
  ------------------------------ */
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

  /* ------------------------------
      UI COMPONENT
  ------------------------------ */
  return (
    <section className="py-10 px-6">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search loans..."
          className="input input-bordered w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
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

      {/* TABLE */}
      <div className="overflow-x-auto bg-base-200 shadow-md rounded-xl">
        <table className="table table-zebra">
          <thead>
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
            {filteredLoans.map((loan) => (
              <tr key={loan._id}>
                <td>
                  <img
                    src={loan.image}
                    className="w-20 h-14 object-cover rounded"
                  />
                </td>
                <td>{loan.title}</td>
                <td>{loan.interest}%</td>
                <td>
                  <span className="badge badge-info">{loan.category}</span>
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

            {filteredLoans.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6">
                  No matching loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------------------
        UPDATE LOAN MODAL
      ------------------------------ */}
      <dialog id="updateModal" className="modal">
        <div className="modal-box w-11/12 max-w-3xl">
          <h3 className="font-bold text-xl mb-4">Update Loan</h3>

          {selectedLoan && (
            <form onSubmit={handleUpdateLoan} className="space-y-4">
              {/* IMAGE UPLOAD */}
              <div>
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

                {imagePreview && (
                  <img
                    src={imagePreview}
                    className="w-32 h-24 rounded-md mt-2 object-cover"
                  />
                )}
              </div>

              {/* Title */}
              <input
                type="text"
                value={selectedLoan.title}
                onChange={(e) =>
                  setSelectedLoan({
                    ...selectedLoan,
                    title: e.target.value,
                  })
                }
                className="input input-bordered w-full"
                placeholder="Loan Title"
              />

              {/* Interest */}
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

              {/* Category */}
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

              <button className="btn btn-primary w-full">Save Changes</button>
            </form>
          )}

          <div className="modal-action">
            <button
              onClick={() => document.getElementById("updateModal").close()}
              className="btn"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
