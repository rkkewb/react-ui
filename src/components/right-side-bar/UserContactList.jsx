import React from "react";
import { ReactComponent as Share } from "../../assets/share.svg";
import { ReactComponent as Close } from "../../assets/close.svg";
import { Row, Col, Image } from "react-bootstrap";
import Avatar from "../../assets/avatar.png";

const UserContactList = ({
  isSharedFolder,
  contactList,
  message,
  cancel,
  shareHandler,
  giveUploadAccess,
  removeContact,
}) => {
  if ( contactList && contactList.length === 0) {
    return <Col className=" mt-2"> {message}</Col>;
  }
  const getProfileImageUrl = (profilePicture) => {
    return profilePicture ? profilePicture : Avatar;
  };
  return (
    <>
      {contactList.map((item, index) => (
        <Col key={index} md={12}>
          <Row className ="mb-1">
            <Col md={3}>
              <Image
                height="60px"
                width="60px"
                className="profile-image rounded-circle"
                src={getProfileImageUrl(item.profilePicture)}
                rounded-circle
              />
            </Col>
            <Col md={9} style ={{wordBreak:'break-all'}} >
              <span>
                <h6>{item.fullname}</h6>
                <p   className="mb-0">{item.email}</p>
              </span>
            </Col>
          </Row>

          <Row className ="mt-2">
            {!isSharedFolder && (
              <Col md={6}>
                {cancel ? (
                  ""
                ) : (
                  <button
                    onClick={() =>
                      giveUploadAccess({ user_id: item.id, isUpload: true })
                    }
                    className="btn btn-dark"
                  >
                    Upload Access
                  </button>
                )}
              </Col>
            )}
            {!isSharedFolder && (
              <Col className="text-center" md={6}>
                {cancel ? (
                  <Close onClick={() => removeContact(item.id)} />
                ) : (
                  <Share onClick={() => shareHandler({ user_id: item.id })} />
                )}
              </Col>
            )}
          </Row>
          <hr />
        </Col>
      ))}
    </>
  );
};

export default UserContactList;
