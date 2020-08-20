import React from "react";
import { ReactComponent as Delete } from "../../assets/delete.svg";
import { ReactComponent as Pencil } from "../../assets/edit.svg";
const DisplayGroupList = ({ groups, update, updateHandler }) => {
  const svgStyle = {
    height: "35px",
  };
  return (
    <div className="row">
      <div className="col">
        <ul className="list-group">
          {groups.map((item, index) => (
            <li className="list-group-item li-contact-list" key={index}>
              <span> {item.groupName}</span>
              <span>
                <Delete
                  onClick={() => update({ deleted: true, id: item.groupID })}
                  style={svgStyle}
                />
                <Pencil
                  onClick={() => updateHandler(item.groupID)}
                  style={svgStyle}
                />
              </span>
            </li>
          ))}
          {groups.length == 0 && (
            <li class="list-group-item">There is no group request</li>
          )}
        </ul>
      </div>
    </div>
  );
};
export default DisplayGroupList;
