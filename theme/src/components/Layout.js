import React from "react";
import { graphql } from "gatsby";

const Layout = ({ children, pageContext }) => {
  let { title, description } = pageContext.frontmatter;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: "1 1 auto",
            flexDirection: "row",
            display: "flex",
            backgroundColor: "red",
          }}
        >
          {/* Main content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100%",
              width: "100%",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "960px",
                flexDirection: "column",
                display: "flex",
                padding: "24px",
                border: "1px dashed",
                borderColor: "red",
              }}
            >
              {/* Heading and description */}
              <div style={{ marginTop: "24px", marginBottom: "24px" }}>
                <div style={{ alignItems: "center", display: "flex" }}>
                  <h1 style={{ marginRight: "8px", marginBottom: "8px" }}>
                    {title}
                  </h1>
                </div>
                {description ? (
                  <div style={{ fontSize: 3, paddingBottom: "8px" }}>
                    {description}
                  </div>
                ) : null}
              </div>
            </div>
            <div style={{ padding: "16px", flex: "1 1 auto" }}>{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
