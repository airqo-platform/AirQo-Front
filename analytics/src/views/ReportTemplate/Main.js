import React, { Component } from "react";
import { render } from "react-dom";
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { Divider, Drawer, Button, Grid } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import Tooltip from "@material-ui/core/Tooltip";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "../../assets/scss/report.css";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      user: props.auth,
    };
  }

  onEditorStateChange = (editorState) => {
    // console.log(editorState)
    this.setState({
      editorState,
    });
  };

  componentDidMount() {
    axios
      .get("http://127.0.0.1:4000/api/v1/report/get_default_report_template")
      .then((res) => {
        let result = res.data[0];
        this.setState({
          editorState: EditorState.createWithContent(
            convertFromRaw(JSON.parse(JSON.stringify(result.report_body)))
          ),
        });
        console.log(result.report_body);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  uploadImageCallBack = (file) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
      xhr.open("POST", "https://api.imgur.com/3/image");
      xhr.setRequestHeader("Authorization", "Client-ID 8d26ccd12712fca");
      const data = new FormData(); // eslint-disable-line no-undef
      data.append("image", file);
      xhr.send(data);
      xhr.addEventListener("load", () => {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      });
      xhr.addEventListener("error", () => {
        const error = JSON.parse(xhr.responseText);
        reject(error);
      });
    });
  };

  render() {
    const { editorState } = this.state;
    const editor = {
      height: "auto",
      width: "210mm",
      margin: "0 auto",
      textAlign: "justify",
    };
    const { user } = this.state.user;
    // console.log(user._id);
    // const rawState = JSON.stringify(
    //   convertToRaw(editorState.getCurrentContent())
    // );
    // console.log(rawState);
    return (
      <div>
        <div>
          <Tooltip title="Save report" placement="right" arrow>
            <Button
              color="primary"
              variant="contained"
              endIcon={<SaveIcon />}
              onClick=""
              className="print"
            >
              <style>{"@media print {.print{display: none;}}"}</style>
              {/* Save Draft */}
            </Button>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Open previous report" placement="right" arrow>
            <Button
              color="primary"
              variant="contained"
              endIcon={<CloudDownloadIcon />}
              onClick=""
              className="print"
            >
              <style>{"@media print {.print{display: none;}}"}</style>
              {/* Load Draft */}
            </Button>
          </Tooltip>
        </div>
        <div style={editor}>
          <Editor
            editorState={editorState}
            onEditorStateChange={this.onEditorStateChange}
            toolbarClassName="hidden-on-print"
            toolbar={{
              inline: { inDropdown: true, className: "hidden-on-print" },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              history: { inDropdown: true },
              image: {
                uploadCallback: this.uploadImageCallBack.bind(this),
                alt: { present: false, mandatory: false },
                previewImage: true,
              },
            }}
          />
          <style>{"@media print {.hidden-on-print{display: none;}}"}</style>
        </div>
      </div>
    );
  }
}

Main.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Main);
