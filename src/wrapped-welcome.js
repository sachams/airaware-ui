import * as React from "react";
import {
  FlexboxGrid,
  Panel,
  Form,
  ButtonToolbar,
  Button,
  Schema,
} from "rsuite";
import { useEffect, useState } from "react";
import "./wrapped-welcome.css";

const { StringType } = Schema.Types;

function WrappedWelcome({ year, onSubmit }) {
  const formRef = React.useRef();
  const [formValue, setFormValue] = React.useState({
    password: "",
  });
  const handleSubmit = () => {
    // When handling form submission
    if (!formRef.current.check()) {
      console.error("Form error");
      return;
    }
    console.log(formValue, "Form data-: ");
  };

  useEffect(() => {
    document.body.classList.add("bg-image-welcome");

    return () => {
      document.body.classList.remove("bg-image-welcome");
    };
  });

  const checkPostcode = (postcode) => {
    if (postcode === "rsuite") {
      return true;
    } else {
      return false;
    }
  };

  const model = Schema.Model({
    postcode: StringType()
      .addRule((value) => {
        // Check the entered postcode
        return checkPostcode(value);
      }, "Please enter a valid postcode")
      .isRequired("This field is required"),
  });

  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Enter your postcode to get started!</h3>} bordered>
          <Form
            ref={formRef}
            model={model}
            checkTrigger="blur"
            onChange={setFormValue}
            fluid
            onSubmit={handleSubmit}
          >
            <Form.Group>
              <Form.Control name="postcode" />
            </Form.Group>
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  Show me Air Aware Wrapped for {year}
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  );
}

export default React.memo(WrappedWelcome);
