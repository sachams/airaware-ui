import React from "react";
import { Container, Content, FlexboxGrid } from "rsuite";
import "./no-match.css";

function NoMatch() {
  return (
    <div>
      <Container>
        <Content>
          <FlexboxGrid align="middle" justify="center">
            <FlexboxGrid.Item style={{ height: "100%" }}>
              <p style={{ fontsize: "20px" }}>Page not found</p>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </div>
  );
}

export default NoMatch;
