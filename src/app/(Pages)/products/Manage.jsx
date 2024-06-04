import React from "react";
import Image from "next/image";

import productOne from "@/assets/product-1.png";
import fillStar from "@/assets/svgs/Star.svg";
import grayStar from "@/assets/svgs/Gray-Star.svg";
import fvrtIcon from "@/assets/svgs/Favourite-icon.svg";

const Manage = () => {
  return (
    <div className="flex gap-5 flex-wrap pb-[30px]">
      {/* product */}
      <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
        <div className="rounded-[8px] flex justify-center pt-[20px] pb-[15px]">
          <Image
            alt=""
            src={productOne}
            className="h-[290px] rounded-[8px] object-contain"
          />
        </div>
        <div className="px-[20px] flex">
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="font-[600] text-[17px]">Apple Watch Series 4</p>
            <p className="text-[var(--price-color)] text-[15px] font-[600]">
              $120.00
            </p>
            <div className="flex gap-0.5 mt-1">
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={grayStar} />
              <p className="text-[12px] text-[--text-color-body] font-[600]">
                (131)
              </p>
            </div>
            <button className="bg-[#E2EAF8] rounded-[8px] text-[14px] font-[600] h-[38px] w-[max-content] px-[13px] mt-[20px]">
              Edit Product
            </button>
          </div>
          <div>
            <Image alt="" src={fvrtIcon} />
          </div>
        </div>
      </div>
      {/* product */}
      <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
        <div className="rounded-[8px] flex justify-center pt-[20px] pb-[15px]">
          <Image
            alt=""
            src={productOne}
            className="h-[290px] rounded-[8px] object-contain"
          />
        </div>
        <div className="px-[20px] flex">
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="font-[600] text-[17px]">Apple Watch Series 4</p>
            <p className="text-[var(--price-color)] text-[15px] font-[600]">
              $120.00
            </p>
            <div className="flex gap-0.5 mt-1">
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={grayStar} />
              <p className="text-[12px] text-[--text-color-body] font-[600]">
                (131)
              </p>
            </div>
            <button className="bg-[#E2EAF8] rounded-[8px] text-[14px] font-[600] h-[38px] w-[max-content] px-[13px] mt-[20px]">
              Edit Product
            </button>
          </div>
          <div>
            <Image alt="" src={fvrtIcon} />
          </div>
        </div>
      </div>
      {/* product */}
      <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
        <div className="rounded-[8px] flex justify-center pt-[20px] pb-[15px]">
          <Image
            alt=""
            src={productOne}
            className="h-[290px] rounded-[8px] object-contain"
          />
        </div>
        <div className="px-[20px] flex">
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="font-[600] text-[17px]">Apple Watch Series 4</p>
            <p className="text-[var(--price-color)] text-[15px] font-[600]">
              $120.00
            </p>
            <div className="flex gap-0.5 mt-1">
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={grayStar} />
              <p className="text-[12px] text-[--text-color-body] font-[600]">
                (131)
              </p>
            </div>
            <button className="bg-[#E2EAF8] rounded-[8px] text-[14px] font-[600] h-[38px] w-[max-content] px-[13px] mt-[20px]">
              Edit Product
            </button>
          </div>
          <div>
            <Image alt="" src={fvrtIcon} />
          </div>
        </div>
      </div>
      {/* product */}
      <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
        <div className="rounded-[8px] flex justify-center pt-[20px] pb-[15px]">
          <Image
            alt=""
            src={productOne}
            className="h-[290px] rounded-[8px] object-contain"
          />
        </div>
        <div className="px-[20px] flex">
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="font-[600] text-[17px]">Apple Watch Series 4</p>
            <p className="text-[var(--price-color)] text-[15px] font-[600]">
              $120.00
            </p>
            <div className="flex gap-0.5 mt-1">
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={grayStar} />
              <p className="text-[12px] text-[--text-color-body] font-[600]">
                (131)
              </p>
            </div>
            <button className="bg-[#E2EAF8] rounded-[8px] text-[14px] font-[600] h-[38px] w-[max-content] px-[13px] mt-[20px]">
              Edit Product
            </button>
          </div>
          <div>
            <Image alt="" src={fvrtIcon} />
          </div>
        </div>
      </div>
      {/* product */}
      <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
        <div className="rounded-[8px] flex justify-center pt-[20px] pb-[15px]">
          <Image
            alt=""
            src={productOne}
            className="h-[290px] rounded-[8px] object-contain"
          />
        </div>
        <div className="px-[20px] flex">
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="font-[600] text-[17px]">Apple Watch Series 4</p>
            <p className="text-[var(--price-color)] text-[15px] font-[600]">
              $120.00
            </p>
            <div className="flex gap-0.5 mt-1">
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={grayStar} />
              <p className="text-[12px] text-[--text-color-body] font-[600]">
                (131)
              </p>
            </div>
            <button className="bg-[#E2EAF8] rounded-[8px] text-[14px] font-[600] h-[38px] w-[max-content] px-[13px] mt-[20px]">
              Edit Product
            </button>
          </div>
          <div>
            <Image alt="" src={fvrtIcon} />
          </div>
        </div>
      </div>
      {/* product */}
      <div className="w-[340px] bg-white rounded-[8px] shadow-sm pb-[20px]">
        <div className="rounded-[8px] flex justify-center pt-[20px] pb-[15px]">
          <Image
            alt=""
            src={productOne}
            className="h-[290px] rounded-[8px] object-contain"
          />
        </div>
        <div className="px-[20px] flex">
          <div className="flex flex-col gap-0.5 flex-1">
            <p className="font-[600] text-[17px]">Apple Watch Series 4</p>
            <p className="text-[var(--price-color)] text-[15px] font-[600]">
              $120.00
            </p>
            <div className="flex gap-0.5 mt-1">
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={fillStar} />
              <Image alt="" src={grayStar} />
              <p className="text-[12px] text-[--text-color-body] font-[600]">
                (131)
              </p>
            </div>
            <button className="bg-[#E2EAF8] rounded-[8px] text-[14px] font-[600] h-[38px] w-[max-content] px-[13px] mt-[20px]">
              Edit Product
            </button>
          </div>
          <div>
            <Image alt="" src={fvrtIcon} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
