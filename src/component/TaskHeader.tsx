import React from "react";
import { Button, DatePicker, Input, Select } from "antd";
import { UnorderedListOutlined, WindowsOutlined } from "@ant-design/icons";
import { checkIsMobile } from "../helper/UtilCommon";
import logout from "../assets/logout_icon.svg";
import vite from "/vite.svg";
import { TASK_CATEGORY } from "../helper/Constant";
import { TaskHeaderProps } from "../types/task";

const { Search } = Input;

const TaskHeader: React.FC<TaskHeaderProps> = ({
  setListView,
  handleLogout,
  handleCategoryChange,
  handleDateChange,
  searchTerm,
  handleSearch,
  setIsModalOpen,
  userEmail,
}) => {
  const isMobile = checkIsMobile();

  return (
    <div className="px-3">
      <header className="flex justify-between items-center bg-[#FAEEFC] h-14 px-4">
        <h1 className="font-bold text-2xl text-[#7B1984]">TaskBuddy</h1>
        <div className="flex items-center gap-2">
          <img
            src={vite}
            alt="User Profile"
            className="rounded-full bg-red-300 p-1 w-10 h-10 md:w-8 md:h-8"
          />
          <span className="hidden md:block text-gray-700">{userEmail}</span>
        </div>
      </header>

      <section className="mt-4">
        {isMobile && (
          <div className="flex justify-end">
            <Button className="!text-white !bg-[#7B1984] !p-4 !py-5 !rounded-full">
              ADD TASK
            </Button>
          </div>
        )}

        <div className="flex justify-between items-center">
          {!isMobile && (
            <div className="flex gap-3">
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setListView(true)}
              >
                List
              </Button>
              <Button
                icon={<WindowsOutlined />}
                onClick={() => setListView(false)}
              >
                Board
              </Button>
            </div>
          )}

          {!isMobile && (
            <Button
              className="border !bg-[#FFF9F9] flex items-center gap-2"
              onClick={handleLogout}
            >
              <img src={logout} alt="logout" />
              <span>Logout</span>
            </Button>
          )}
        </div>
      </section>

      <section className="mt-4 max-md:px-1">
        <div className="flex max-md:flex-col md:justify-between md:items-center max-md:gap-3">
          <div className="flex max-md:flex-col gap-2 md:items-center">
            <p className="text-[#231F20D1]">Filter by:</p>
            <div className="flex gap-2">
              <Select
                defaultValue="Category"
                className="custom-select custom-loan-container"
                options={TASK_CATEGORY}
                onChange={handleCategoryChange}
              />
              <div className="custom-datepicker">
                <DatePicker
                  onChange={handleDateChange}
                  placeholder="Due Date"
                  className="!p-4"
                />
              </div>
            </div>
          </div>

          <div className="flex md:gap-4 md:items-center max-md:justify-start custom-loan-searchbox">
            <Search
              placeholder="Search"
              value={searchTerm}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {!isMobile && (
              <Button
                className="!text-white !bg-[#7B1984] !p-4 !py-5"
                onClick={() => setIsModalOpen(true)}
              >
                ADD TASK
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TaskHeader;
