import React from "react";
import "./Layout.css";

const Layout = ({ children, pageContext }) => {
  let { title, description } = pageContext.frontmatter;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div
          style={{
            flex: "1 1 auto",
            flexDirection: "row",
            display: "flex",
            // backgroundColor: "silver",
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
                    <p>{description}</p>
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
