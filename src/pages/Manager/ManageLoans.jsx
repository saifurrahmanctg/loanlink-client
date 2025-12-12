import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../Provider/AuthProvider";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const API = import.meta.env.VITE_API_URL;
const IMGBB_KEY = import.meta.env.VITE_IMGBB_KEY;

export default function ManageLoans() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // fetch loans created by current manager
  const {
    data: loans = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manage-loans", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await fetch(
        `${API}/loans?createdBy=${encodeURIComponent(user.email)}`
      );
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
    enabled: !!user?.email,
  });

  // Only show loans created by current user
  const managerLoans = loans.filter((loan) => loan.createdBy === user?.email);

  const filteredLoans = managerLoans.filter((loan) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (loan.title && loan.title.toLowerCase().includes(q)) ||
      (loan.category && loan.category.toLowerCase().includes(q));
    const matchesCategory = categoryFilter
      ? loan.category === categoryFilter
      : true;
    return matchesSearch && matchesCategory;
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API}/loans/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete loan");
      return res.json();
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Loan removed successfully.", "success");
      refetch();
    },
    onError: (err) => {
      Swal.fire("Error", err.message || "Delete failed", "error");
    },
  });

  const handleDelete = (loan) => {
    Swal.fire({
      title: `Delete "${loan.title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(loan._id);
    });
  };

  // Open update modal
  const openUpdateModal = (loan) => {
    setSelectedLoan({
      ...loan,
      // ensure availableEMIPlans is string for editing
      availableEMIPlansStr: (loan.availableEMIPlans || []).join(", "),
    });
    setImagePreview(loan.image || null);
    const modal = document.getElementById("manageUpdateModal");
    if (modal?.showModal) {
      modal.showModal();
      // focus first input shortly after open for accessibility
      setTimeout(() => modal.querySelector("input")?.focus(), 80);
    }
  };

  // Image upload to ImgBB
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const url = `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`;
      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();

      if (data?.success) {
        setImagePreview(data.data.url);
        setSelectedLoan((s) => ({ ...s, image: data.data.url }));
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      Swal.fire("Image Upload Error", err.message || "Upload failed", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  // Update mutation (PATCH)
  const updateMutation = useMutation({
    mutationFn: async ({ id, updateData }) => {
      const res = await fetch(`${API}/loans/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Failed to update loan");
      }
      return res.json();
    },
    onSuccess: () => {
      Swal.fire("Updated!", "Loan updated successfully.", "success");
      refetch();
      const modal = document.getElementById("manageUpdateModal");
      modal?.close();
      setSelectedLoan(null);
      setImagePreview(null);
    },
    onError: (err) => {
      Swal.fire("Update Error", err.message || "Update failed", "error");
    },
  });

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (!selectedLoan) return;

    // sanitize/prepare update payload
    const updateData = {
      title: selectedLoan.title,
      category: selectedLoan.category,
      interest: Number(selectedLoan.interest) || 0,
      maxLoanLimit: Number(selectedLoan.maxLoanLimit) || 0,
      description: selectedLoan.description || "",
      availableEMIPlans: (selectedLoan.availableEMIPlansStr || "")
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !Number.isNaN(n)),
      image: selectedLoan.image || imagePreview || "",
      // createdBy should not be changed
    };

    updateMutation.mutate({ id: selectedLoan._id, updateData });
  };

  // Reusable detail component for modal fields
  const InputField = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder,
  }) => (
    <div className="space-y-2">
      <label className="font-semibold text-sm">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input input-bordered w-full bg-base-100"
      />
    </div>
  );

  const TextAreaField = ({ label, value, onChange, rows = 4 }) => (
    <div className="space-y-2">
      <label className="font-semibold text-sm">{label}</label>
      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="textarea textarea-bordered w-full bg-base-100"
      />
    </div>
  );

  // collect unique categories for filter dropdown
  const categories = Array.from(
    new Set(loans.map((l) => l.category).filter(Boolean))
  );

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
            Manage <span className="text-gradient">Loans</span>
          </h2>
          <p className="text-gray-600">
            Loans you have created — search, edit or remove
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Search loans by title or category..."
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
            {categories.map((cat) => (
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
                <th>Max Limit</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    No loans found for this filter.
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => (
                  <tr
                    key={loan._id}
                    className="hover:bg-base-200 transition-all duration-150"
                  >
                    <td>
                      <img
                        src={loan.image}
                        alt={loan.title}
                        className="w-20 h-14 object-cover rounded"
                      />
                    </td>

                    <td className="font-semibold">{loan.title}</td>

                    <td>{loan.interest}%</td>

                    <td>
                      <span className="badge badge-info">{loan.category}</span>
                    </td>

                    <td>৳{Number(loan.maxLoanLimit).toLocaleString()}</td>

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
                          onClick={() => handleDelete(loan)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Update Modal (manager edits allowed except showHome) */}
        <dialog id="manageUpdateModal" className="modal">
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-center font-rajdhani text-gradient text-2xl mb-4">
              Update Loan
            </h3>

            {selectedLoan ? (
              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Title"
                    value={selectedLoan.title}
                    onChange={(v) =>
                      setSelectedLoan((s) => ({ ...s, title: v }))
                    }
                  />

                  <InputField
                    label="Category"
                    value={selectedLoan.category}
                    onChange={(v) =>
                      setSelectedLoan((s) => ({ ...s, category: v }))
                    }
                  />

                  <InputField
                    label="Interest (%)"
                    value={selectedLoan.interest}
                    onChange={(v) =>
                      setSelectedLoan((s) => ({ ...s, interest: v }))
                    }
                    type="number"
                  />

                  <InputField
                    label="Max Loan Limit"
                    value={selectedLoan.maxLoanLimit}
                    onChange={(v) =>
                      setSelectedLoan((s) => ({ ...s, maxLoanLimit: v }))
                    }
                    type="number"
                  />
                </div>

                <TextAreaField
                  label="Description"
                  value={selectedLoan.description}
                  onChange={(v) =>
                    setSelectedLoan((s) => ({ ...s, description: v }))
                  }
                />

                <InputField
                  label="Available EMI Plans (comma separated months)"
                  value={selectedLoan.availableEMIPlansStr}
                  onChange={(v) =>
                    setSelectedLoan((s) => ({ ...s, availableEMIPlansStr: v }))
                  }
                  placeholder="e.g. 3,6,12"
                />

                {/* Image upload */}
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className="font-semibold text-sm">Loan Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="file-input w-full mt-2"
                      onChange={handleImageUpload}
                    />
                    {uploadingImage && (
                      <p className="text-sm text-blue-500 mt-1">
                        Uploading image...
                      </p>
                    )}
                  </div>

                  <div>
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="w-32 h-20 rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-32 h-20 rounded-md bg-base-200 flex items-center justify-center text-sm text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full flex gap-2">
                  <button type="submit" className="btn bg-gradient w-1/2">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline w-1/2"
                    onClick={() => {
                      const modal =
                        document.getElementById("manageUpdateModal");
                      modal?.close();
                      setSelectedLoan(null);
                      setImagePreview(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </dialog>
      </motion.div>
    </section>
  );
}
