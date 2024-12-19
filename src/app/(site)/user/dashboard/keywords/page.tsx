"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CsvUpload } from "./components/CsvUpload";

interface Keyword {
  id: string;
  term: string;
  enabled: boolean;
  createdAt: Date;
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [editingKeyword, setEditingKeyword] = useState<Keyword | null>(null);
  const router = useRouter();

  // Fetch keywords
  const fetchKeywords = async () => {
    try {
      const response = await fetch("/api/keywords");
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to fetch keywords");
      }
      const data = await response.json();
      setKeywords(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load keywords");
    }
  };

  useEffect(() => {
    fetchKeywords();
  }, []);

  // Add keyword
  const handleAddKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/keywords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: newKeyword.trim() }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to add keyword");
      }
      
      toast.success("Keyword added successfully");
      setNewKeyword("");
      fetchKeywords();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add keyword");
    } finally {
      setIsLoading(false);
    }
  };

  // Edit keyword
  const handleEditKeyword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKeyword || !editingKeyword.term.trim()) {
      toast.error("Please enter a keyword");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/keywords/${editingKeyword.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: editingKeyword.term.trim() }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update keyword");
      }
      
      toast.success("Keyword updated successfully");
      setEditingKeyword(null);
      fetchKeywords();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update keyword");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete keyword
  const handleDeleteKeyword = async (id: string) => {
    if (!confirm("Are you sure you want to delete this keyword?")) return;

    try {
      const response = await fetch(`/api/keywords/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to delete keyword");
      }
      
      toast.success("Keyword deleted successfully");
      fetchKeywords();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete keyword");
    }
  };

  // Toggle keyword
  const handleToggleKeyword = async (id: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/keywords/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Failed to update keyword");
      }
      
      toast.success("Keyword updated successfully");
      fetchKeywords();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update keyword");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Keywords</h1>
        <CsvUpload onUploadComplete={fetchKeywords} />
      </div>
      {/* Add Keyword Form */}
      <div className="bg-white dark:bg-gray-dark rounded-xl shadow-sm mb-6 p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {editingKeyword ? "Edit Keyword" : "Add New Keyword"}
        </h2>
        <form onSubmit={editingKeyword ? handleEditKeyword : handleAddKeyword} className="flex gap-4">
          <input
            type="text"
            value={editingKeyword ? editingKeyword.term : newKeyword}
            onChange={(e) => 
              editingKeyword 
                ? setEditingKeyword({ ...editingKeyword, term: e.target.value })
                : setNewKeyword(e.target.value)
            }
            placeholder="Enter a keyword to track"
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/25 disabled:opacity-50"
          >
            {isLoading 
              ? (editingKeyword ? "Updating..." : "Adding...") 
              : (editingKeyword ? "Update Keyword" : "Add Keyword")}
          </button>
          {editingKeyword && (
            <button
              type="button"
              onClick={() => setEditingKeyword(null)}
              className="inline-flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 px-6 py-2.5 text-center text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-500/25 disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Keywords List */}
      <div className="bg-white dark:bg-gray-dark rounded-xl shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Your Keywords</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keyword</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {keywords.map((keyword) => (
                  <tr key={keyword.id}>
                    <td className="py-4 text-sm text-gray-900 dark:text-white">{keyword.term}</td>
                    <td className="py-4">
                      <button
                        onClick={() => handleToggleKeyword(keyword.id, keyword.enabled)}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          keyword.enabled
                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        }`}
                      >
                        {keyword.enabled ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                      {new Date(keyword.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 space-x-3">
                      <button
                        onClick={() => setEditingKeyword(keyword)}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteKeyword(keyword.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {keywords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No keywords found. Add your first keyword above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
