import React from "react";

const ListTabs = ({ setCurrentTab, currentTab, isHideShare }) => {
  return (
    <ul className="nav nav-pills nav-justified mb-2 w-100">
      {!isHideShare && (
        <li
          className={` border text-white border-success nav-link p-2 ${
            currentTab == "SHARED_LIST" ? "active" : ""
          }`}
          onClick={() => setCurrentTab("SHARED_LIST")}
        >
          Shared
        </li>
      )}
      <li
        className={`  border border-success nav-link pl-2 ${
          currentTab == "CONTACTS" ? "active" : ""
        }`}
        onClick={() => setCurrentTab("CONTACTS")}
      >
        Contacts
      </li>
      <li
        className={`  border border-success nav-link ml-2 mr-2 pl-2 ${
          currentTab == "GROUPS" ? "active" : ""
        }`}
        onClick={() => setCurrentTab("GROUPS")}
      >
        Groups
      </li>
    </ul>
  );
};
export default ListTabs;
