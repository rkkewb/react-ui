import React, { useEffect, useState } from "react";
import { Get, Post } from "../../service/service.setup";
import { ReactComponent as Close } from "../../assets/close.svg";
import CustomLoader from "../loader/loader";
import Paginate from "../common/paginate";
import {
  getStartIndex,
  getPageCount,
  PAGE_OFF_SET,
} from "../common/pagination.config";
const SharedListUL = ({ list, selectedItems, images }) => {
  const [sharedList, setShareWithList] = useState([]);
  const [displaySharedList, setDisplaySharedList] = useState([]);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [folderId, setFolderId] = useState(0);
  useEffect(() => {
    setIsShowLoader(true);
    let fileId = (selectedItems == 1 ? images.id : 0);
    if (selectedItems != 1) {
      for (let key in selectedItems) {
        if (selectedItems[key]) {
          fileId = key;
        }
      }
    }
    const imageId = images ? images.updateImages[0].id : 0;
    
    getFolders(fileId, imageId);
    setFolderId(fileId);
  }, []);

  async function getFolders(fileId, id = false) {
    try {
      const URI = id ? "getPageSharedList" : "getFileSharedList";
      const user = await Post(`/${URI}`, {
        fileId,
        id,
      });
      if (
        user.data.code == "200" &&
        user.data.message == "Page is not shared with anyone."
      ) {
        setShareWithList([{ fullname: "Page is not shared with anyone" }]);
      }
      setIsShowLoader(false);
      setShareWithList([...user.data.data.profile]);
      displaySharedList(user.data.data.profile.splice(0, PAGE_OFF_SET));
    } catch (error) {
      setIsShowLoader(false);
    }
  }
  const removeFullAccess = async (id) => {
    const restUser = sharedList.filter((user) => user.id != id);
    if (restUser.length > 0) {
      setShareWithList(restUser);
    } else {
      setShareWithList([{ fullname: "Page is not shared with anyone" }]);
    }
    const response = await Post("/removeshareFile", {
      user_id: id,
      file_id: folderId,
    });
  };

  return (
    <ul className="list-group">
      {isShowLoader && (
        <li style={{ minHeight: "5rem" }}>
          <CustomLoader />
        </li>
      )}
      {sharedList.map((item, index) => (
        <li className="list-group-item li-contact-list" key={index}>
          <span> {item.fullname}</span>

          {item.fullname != "Page is not shared with anyone" && (
            <button
              className="btn btn-danger"
              onClick={() => removeFullAccess(item.id)}
            >
              Remove
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default SharedListUL;
