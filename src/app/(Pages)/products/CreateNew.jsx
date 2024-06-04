import React from "react";

import { FaCamera } from "react-icons/fa6";

const CreateNew = () => {
  return (
    <div className="bg-white rounded-[8px] shadow-sm px-[20px] py-[25px]">
      <p className="text-[20px] font-[600]">Create New Product</p>
      <p className="text-[18px] font-[600] pt-[20px]">General Information</p>
      <div>
        <div className="flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Name</label>
          <input
            placeholder="Product Name"
            className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
          />
        </div>
        <div className="flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Product Information</label>
          <input
            placeholder="Product Information"
            className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
          />
        </div>
        <div className="flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Description</label>
          <textarea
            placeholder="Write about product"
            className="focus:outline-none border-[2px] border-gray-200 py-2 rounded-[8px] px-[15px] h-[110px] text-[15px]"
          />
        </div>
      </div>
      <p className="text-[18px] font-[600] pt-[20px]">Pricing</p>
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-10">
        <div className="flex-1 flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Price</label>
          <input
            placeholder="$"
            className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Discount</label>
          <input className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]" />
        </div>
      </div>
      <p className="text-[18px] font-[600] pt-[20px]">Media</p>
      <div className="my-[15px]">
        <label className="text-[#777777]">Images</label>
        <div className="flex gap-5 justify-between my-[15px] flex-col xl:flex-row">
          <div className="min-w-[230px] h-[180px] rounded-[10px] border-[2px] border-dashed border-blue-100 bg-[#F8F8FF] flex items-center justify-center flex-col">
            <FaCamera className="h-[40px] w-[45px] text-[var(--text-color-body)] mb-4" />
            <p className="font-[500] text-[13px] text-center">
              Drag & drop files or{" "}
              <span className="underline text-[var(--text-color)] cursor-pointer">
                Browse
              </span>
            </p>
            <p className="text-[11px] text-[var(--text-color-body)] text-center mt-1">
              Supported formats: JPEG, PNG
            </p>
          </div>
          <div className="min-w-[230px] h-[180px] rounded-[10px] border-[2px] border-dashed border-blue-100 bg-[#F8F8FF] flex items-center justify-center flex-col">
            <FaCamera className="h-[40px] w-[45px] text-[var(--text-color-body)] mb-4" />
            <p className="font-[500] text-[13px] text-center">
              Drag & drop files or{" "}
              <span className="underline text-[var(--text-color)] cursor-pointer">
                Browse
              </span>
            </p>
            <p className="text-[11px] text-[var(--text-color-body)] text-center mt-1">
              Supported formats: JPEG, PNG
            </p>
          </div>
          <div className="min-w-[230px] h-[180px] rounded-[10px] border-[2px] border-dashed border-blue-100 bg-[#F8F8FF] flex items-center justify-center flex-col">
            <FaCamera className="h-[40px] w-[45px] text-[var(--text-color-body)] mb-4" />
            <p className="font-[500] text-[13px] text-center">
              Drag & drop files or{" "}
              <span className="underline text-[var(--text-color)] cursor-pointer">
                Browse
              </span>
            </p>
            <p className="text-[11px] text-[var(--text-color-body)] text-center mt-1">
              Supported formats: JPEG, PNG
            </p>
          </div>
          <div className="min-w-[230px] h-[180px] rounded-[10px] border-[2px] border-dashed border-blue-100 bg-[#F8F8FF] flex items-center justify-center flex-col">
            <FaCamera className="h-[40px] w-[45px] text-[var(--text-color-body)] mb-4" />
            <p className="font-[500] text-[13px] text-center">
              Drag & drop files or{" "}
              <span className="underline text-[var(--text-color)] cursor-pointer">
                Browse
              </span>
            </p>
            <p className="text-[11px] text-[var(--text-color-body)] text-center mt-1">
              Supported formats: JPEG, PNG
            </p>
          </div>
        </div>
      </div>
      <p className="text-[18px] font-[600] pt-[20px]">Category</p>
      <div>
        <div className="flex-1 flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Category</label>
          <select className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px] text-[var(--text-color-body)]">
            <option selected disabled>
              Select an option
            </option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Stock Status</label>
          <select className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px] text-[var(--text-color-body)]">
            <option selected disabled>
              Select an option
            </option>
            <option>Option 1</option>
            <option>Option 2</option>
            <option>Option 3</option>
          </select>
        </div>
      </div>
      <p className="text-[18px] font-[600] pt-[20px]">Variants</p>
      <div className="my-[15px]">
        <label className="text-[#777777]">Size</label>
        <div className="my-[15px] flex flex-col gap-2 lg:gap-10 xl:gap-40 md:flex-row">
          <label className="flex gap-3 cursor-pointer text-[var(--text-color-body)] w-[100px]">
            <input type="checkbox" />
            Small
          </label>
          <label className="flex gap-3 cursor-pointer text-[var(--text-color-body)] w-[100px]">
            <input type="checkbox" />
            Medium
          </label>
          <label className="flex gap-3 cursor-pointer text-[var(--text-color-body)] w-[100px]">
            <input type="checkbox" />
            Large
          </label>
        </div>
        <label className="text-[#777777]">Color</label>
        <div className="my-[15px] flex flex-col gap-2 lg:gap-10 xl:gap-40 md:flex-row">
          <label className="flex gap-3 cursor-pointer text-[var(--text-color-body)] w-[100px]">
            <input type="checkbox" />
            Blue
          </label>
          <label className="flex gap-3 cursor-pointer text-[var(--text-color-body)] w-[100px]">
            <input type="checkbox" />
            Green
          </label>
          <label className="flex gap-3 cursor-pointer text-[var(--text-color-body)] w-[100px]">
            <input type="checkbox" />
            Yellow
          </label>
        </div>
      </div>
      <p className="text-[18px] font-[600] pt-[20px]">FAQs</p>
      <div>
        <div className="flex-1 flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Question</label>
          <input
            placeholder="Type question"
            className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1 my-[15px]">
          <label className="text-[#777777]">Answer</label>
          <input
            placeholder="Type answer"
            className="focus:outline-none border-[2px] border-gray-200 rounded-[8px] px-[15px] h-[50px] text-[15px]"
          />
        </div>
      </div>
      <div className="flex flex-col gap-10 pb-8">
        <button className="bg-[#FE4242] rounded-[8px] h-[40px] px-[40px] py-[10px] text-white text-[15px] font-[500] w-[max-content]">
          Add More
        </button>
        <button className="bg-[#FE4242] rounded-[8px] h-[40px] px-[40px] py-[10px] text-white text-[15px] font-[500] w-[max-content]">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CreateNew;
