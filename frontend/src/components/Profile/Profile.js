import React, { Fragment } from 'react'
import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay'
import {
  Row, Col, Button,
  Modal, ModalHeader, ModalBody,
  ModalFooter, Input,
  Form
} from 'reactstrap'
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import UpdateProfilePictureMutation from '../mutations/UploadProfilePicture';
import environment from '../Environment';

export class Profile extends React.Component {
  state = {
    src: null,
    crop: {
      unit: "%",
      width: 50,
      aspect: 1 / 1
    },
    modal: false,
    blob: null
  };
  toggleModal = () => {
    const { modal } = this.state
    if (modal) this.setState({ modal: !modal, src: null })
    else this.setState({ modal: !modal });
  }
  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = crop => {
    this.setState({ crop });
  };
  makeClientCrop = async (crop) => {
    if (this.imageRef && crop.width && crop.height) {
      this.getCroppedImg(
        this.imageRef,
        crop
      );
    }
  }
  getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    canvas.toBlob(blob => {
      if (!blob) return;
      this.setState({ blob }) //added by SO huy nguyen 
    });
  }
  updateProfilePicture = e => {
    e.preventDefault();
    this.setState({ loading: true });
    console.log('upload mutation')
    const { viewer } = this.props
    const mutation = UpdateProfilePictureMutation(
      { userId: viewer.id },
      this.props.relay.environment,
      {
        uploadables: { image: this.state.blob },
        onCompleted: () => {
          this.setState({ loading: false, src: null, modal: false })
        },
        onFailure: error => console.error(error),
      },
    );
    mutation.commit()
  }
  render() {
    const { crop, src, modal, loading } = this.state;
    const { viewer } = this.props
    return (
      <Fragment>
        <Row>
          <Col>
            <Modal isOpen={modal} toggle={this.toggleModal}>
              <Form encType="multipart/form-data" id='upload-img-frm' onSubmit={this.updateProfilePicture}>
                <ModalHeader toggle={this.toggleModal}>Update Profile Picture</ModalHeader>
                <ModalBody>
                  <Input type="file" onChange={this.onSelectFile} />
                  {src && (
                    <ReactCrop
                      src={src}
                      crop={crop}
                      onImageLoaded={this.onImageLoaded}
                      onComplete={this.onCropComplete}
                      onChange={this.onCropChange}
                    />
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button disabled={loading} type='submit' color="primary">Save</Button>
                  <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                </ModalFooter>
              </Form>
            </Modal>
            <div className='mb-3 d-flex flex-column align-items-center justify-content-center'>
              <div className='profile-picture-container'>
                <img
                  src={`${process.env.PUBLIC_URL}/static/images/${viewer.profilePicture}`}
                  className="rounded"
                  alt=''
                />
                <Button
                  size='sm'
                  color="primary"
                  onClick={this.toggleModal}
                  className='update-profile-btn'
                >
                  Update
              </Button>
              </div>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export const ProfileFC = createFragmentContainer(
  Profile,
  {
    viewer: graphql`
      fragment Profile_viewer on User {
        id
        profilePicture
        username
      }
    `
  }
);