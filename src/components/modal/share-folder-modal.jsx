import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ContactList from "../contactlist/display.contactlist";
import { Get, Post } from "../../service/service.setup";
import TextField from "@material-ui/core/TextField";
import SearchedContactList from "../contactlist/display-searched-contact-list";
import { addContact, searchContact } from "../../service/sharefiles";
import DisplayGroupList from "../add-friend/display-group";
import ListTabs from "../add-friend/tab";
import SharedListUL from "../modal/show-shared-list-modal";
import {
  getStartIndex,
  getPageCount,
  PAGE_OFF_SET,
} from "../common/pagination.config";
const ShareFolderModal = ({ show, hide, selected, images, count }) => {
  const [contactList, setContactList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [searchedContactList, setSearchedContactList] = useState("");
  const [AllSearchedContactList, setAllSearchedContactList] = useState("");
  const [
    searchedContactPaginationCount,
    setSearchedContactPaginationCount,
  ] = useState(1);
  const [currentList, setCurrentList] = useState("SHARED_LIST");
  const [selectedFileCounter, setFileCounter] = useState(0);
  const onClose = () => {
    setSearchedContactList([]);
    setSearchUserId("");
    setAllSearchedContactList([]);
    setSearchedContactPaginationCount([]);
    hide(false);
  };
  async function getContactRequest() {
    try {
      const contacts = await Get("showUserContactList");
      setContactList(contacts.data.data.profileList);
    } catch (error) {}
  }
  async function getGroups() {
    try {
      const res = await Get("showAllUserGroup");
      if (res.data.code == "200") {
        setGroups(res.data.data.userGroup);
      }
    } catch (error) {}
  }
  const userSearchHandler = async () => {
    try {
      const user = await searchContact(searchUserId);
      // setSearchedContactList(user.data.data.profile);
      setAllSearchedContactList([...user.data.data.profile]);
      setSearchedContactList(user.data.data.profile.splice(0, PAGE_OFF_SET));
    } catch {
      // setSearchedContactList([]);
    }
  };
  useEffect(() => {
    fileCounter();
    setSearchedContactList([]);
  }, [selected]);
  useEffect(() => {
    imageCounter();
  }, [count]);
  const addContactHandler = async (id) => {
    const user = await addContact(id);
    //  const user = true;
    const addedUser = searchedContactList.filter((item) => item.id == id)[0];
    addedUser.requestAlreadySent = true;

    if (user) {
      setSearchedContactList([
        {
          ...addedUser,
          requestAlreadySent: true,
        },
      ]);
    }
  };
  const shareGroupHandler = (id) => {
    shareWith(id);
  };
  async function shareWith(id) {
    if (!window.confirm("Are you sure you want to Share Folder ?")) return;

    try {
      const folderIds = [];
      const imagesIds = [];
      let imagesRequest = {};
      for (let key in selected) {
        if (selected[key]) folderIds.push(key);
      }
      if (images && images.id) {
        images.updateImages.forEach((item) => imagesIds.push(item.id));
        imagesRequest = {
          imageIds: imagesIds,
          group_id: id,
          file_id: images.id,
          active: true,
        };
      }

      const request = { imageIds: folderIds, group_id: id, active: true };

      const requestData = images && images.id ? imagesRequest : request;
      const URL = images && images.id ? "sharePage" : "shareFile";
      const contacts = await Post(`/${URL}`, requestData);
      if (contacts.data.code == "200") {
        alert(contacts.data.message);
      }
      hide(false);
    } catch (error) {}
  }
  useEffect(() => {
    getGroups();
    getContactRequest();
  }, []);
  const fileCounter = () => {
    let count = 0;
    for (let key in selected) {
      if (selected[key]) count++;
    }
    setFileCounter(count);
  };
  const imageCounter = () => {
    setFileCounter(count);
  };
  // pagination
  const setCurrentSelectedContacts = (number) => {
    const allContacts = [...AllSearchedContactList];
    setSearchedContactList(
      allContacts.splice(getStartIndex(number), PAGE_OFF_SET)
    );
    setSearchedContactPaginationCount(number);
  };

  const searchedContactsNextPrev = (type) => {
    if (type === "NEXT") {
      if (
        searchedContactPaginationCount == getPageCount(AllSearchedContactList)
      )
        return;
      setCurrentSelectedContacts(searchedContactPaginationCount + 1);
    } else {
      if (searchedContactPaginationCount == 1) return;
      setCurrentSelectedContacts(searchedContactPaginationCount - 1);
    }
  };
  return (
    <Modal size="md" show={show} onHide={() => hide(false)} animation={true}>
      <Modal.Header>
        <ListTabs
          isHideShare={selectedFileCounter > 1}
          setCurrentTab={setCurrentList}
          currentTab={currentList}
        />
      </Modal.Header>
      <Modal.Body>
        {currentList == "GROUPS" && (
          <DisplayGroupList
            shareWith={shareGroupHandler}
            groups={groups}
            isShare={true}
          />
        )}
        {currentList == "CONTACTS" && (
          <ul>
            <li className="share-search">
              <TextField
                style={{ width: "80%" }}
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                id="outlined-basic"
                label="Enter UserName"
                variant="outlined"
              />
              <button onClick={userSearchHandler} className="btn btn-success">
                Search
              </button>
            </li>{" "}
          </ul>
        )}
        {searchedContactList && currentList == "CONTACTS" && (
          <SearchedContactList
            profileLists={searchedContactList}
            addFriend={addContactHandler}
            hide={hide}
            selected={selected}
            images={images}
            isShare={true}
            setCurrentItems={setCurrentSelectedContacts}
            totalCount={getPageCount(AllSearchedContactList)}
            currentPaginationCount={searchedContactPaginationCount}
            nextPrev={searchedContactsNextPrev}
          ></SearchedContactList>
        )}
        {currentList == "CONTACTS" && (
          <ContactList
            hide={hide}
            selected={selected}
            images={images}
            isShare={true}
            profileList={contactList}
          ></ContactList>
        )}
        {currentList == "SHARED_LIST" && (
          <SharedListUL images={images} selectedItems={selected} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn-danger btn"
          variant="secondary"
          onClick={onClose}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};
export default ShareFolderModal;
