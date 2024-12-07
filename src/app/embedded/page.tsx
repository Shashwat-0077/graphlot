export default function Embed() {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                backgroundColor: "#191919",
            }}
        >
            <h1 style={{ fontSize: "20px", textAlign: "center" }}>
                My Custom Notion Widget
            </h1>
            <p style={{ textAlign: "center" }}>
                This is a demo of an embedded widget.
            </p>
        </div>
    );
}
