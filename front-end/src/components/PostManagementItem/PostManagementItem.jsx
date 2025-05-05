import React from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";
import { formatDate } from "../../helpers/formatCreatedAt";

const PostManagementItem = ({ post, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-4 hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-4">
            <h3 className="text-lg font-medium text-blue-600">{post.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              <span>Ngày đăng: {formatDate(post.createdAt)}</span>
            </div>
          </div>

          <div className="col-span-6">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <span className="text-sm font-medium text-gray-700 mr-1">
                  Yêu cầu:
                </span>
                <span className="text-sm text-gray-600">
                  {post.requirements}
                </span>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700 mr-1">
                  Kinh nghiệm:
                </span>
                <span className="text-sm text-gray-600">
                  {post.experience === "0 năm" ? "Không" : post.experience}
                </span>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex justify-end space-x-6">
            <button
              onClick={() => onEdit(post.id)}
              className="text-amber-400 hover:text-amber-500 transition-colors"
              aria-label="Edit"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="text-red-500 hover:text-red-600 transition-colors"
              aria-label="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManagementItem;
