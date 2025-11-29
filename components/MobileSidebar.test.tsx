import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  SidebarProvider,
  SidebarOverlay,
  SidebarContainer,
  SidebarHeader,
  MobileHeader,
  useSidebar,
  zIndex,
} from "@/components/MobileSidebar";

// Test component that exposes sidebar state
function TestSidebarConsumer() {
  const { isOpen, open, close, toggle } = useSidebar();
  return (
    <div>
      <span data-testid="is-open">{isOpen ? "open" : "closed"}</span>
      <button onClick={open}>Open</button>
      <button onClick={close}>Close</button>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe("MobileSidebar", () => {
  describe("zIndex constants", () => {
    it("exports z-index constants", () => {
      expect(zIndex.overlay).toBe("z-40");
      expect(zIndex.sidebar).toBe("z-50");
      expect(zIndex.header).toBe("z-10");
    });
  });

  describe("SidebarProvider and useSidebar", () => {
    it("provides sidebar state context", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      expect(screen.getByTestId("is-open")).toHaveTextContent("closed");
    });

    it("allows opening the sidebar", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByText("Open"));
      expect(screen.getByTestId("is-open")).toHaveTextContent("open");
    });

    it("allows closing the sidebar", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByText("Open"));
      fireEvent.click(screen.getByText("Close"));
      expect(screen.getByTestId("is-open")).toHaveTextContent("closed");
    });

    it("allows toggling the sidebar", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByText("Toggle"));
      expect(screen.getByTestId("is-open")).toHaveTextContent("open");

      fireEvent.click(screen.getByText("Toggle"));
      expect(screen.getByTestId("is-open")).toHaveTextContent("closed");
    });

    it("throws error when useSidebar is used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      expect(() => render(<TestSidebarConsumer />)).toThrow(
        "useSidebar must be used within a SidebarProvider"
      );

      consoleSpy.mockRestore();
    });
  });

  describe("SidebarOverlay", () => {
    it("renders nothing when sidebar is closed", () => {
      const { container } = render(
        <SidebarProvider>
          <SidebarOverlay />
        </SidebarProvider>
      );

      expect(container.querySelector("[aria-hidden]")).toBeNull();
    });

    it("renders overlay when sidebar is open", () => {
      const { container } = render(
        <SidebarProvider>
          <TestSidebarConsumer />
          <SidebarOverlay />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByText("Open"));
      const overlay = container.querySelector("[aria-hidden='true']");
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass("fixed", "inset-0");
    });

    it("closes sidebar when overlay is clicked", () => {
      const { container } = render(
        <SidebarProvider>
          <TestSidebarConsumer />
          <SidebarOverlay />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByText("Open"));
      const overlay = container.querySelector("[aria-hidden='true']");
      fireEvent.click(overlay!);
      expect(screen.getByTestId("is-open")).toHaveTextContent("closed");
    });
  });

  describe("SidebarContainer", () => {
    it("renders children", () => {
      render(
        <SidebarProvider>
          <SidebarContainer>
            <span>Sidebar Content</span>
          </SidebarContainer>
        </SidebarProvider>
      );

      expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
    });

    it("has translate-x-full class when closed", () => {
      render(
        <SidebarProvider>
          <SidebarContainer>Content</SidebarContainer>
        </SidebarProvider>
      );

      const sidebar = screen.getByRole("complementary");
      expect(sidebar.className).toContain("-translate-x-full");
    });

    it("has translate-x-0 class when open", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
          <SidebarContainer>Content</SidebarContainer>
        </SidebarProvider>
      );

      fireEvent.click(screen.getByText("Open"));
      const sidebar = screen.getByRole("complementary");
      expect(sidebar.className).toContain("translate-x-0");
    });
  });

  describe("SidebarHeader", () => {
    it("renders default Files title when no children provided", () => {
      render(
        <SidebarProvider>
          <SidebarHeader />
        </SidebarProvider>
      );

      expect(screen.getByText("Files")).toBeInTheDocument();
    });

    it("renders custom children when provided", () => {
      render(
        <SidebarProvider>
          <SidebarHeader>
            <span>Custom Header</span>
          </SidebarHeader>
        </SidebarProvider>
      );

      expect(screen.getByText("Custom Header")).toBeInTheDocument();
    });

    it("has close button", () => {
      render(
        <SidebarProvider>
          <SidebarHeader />
        </SidebarProvider>
      );

      expect(screen.getByRole("button", { name: /close sidebar/i })).toBeInTheDocument();
    });

    it("closes sidebar when close button is clicked", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
          <SidebarHeader />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByText("Open"));
      fireEvent.click(screen.getByRole("button", { name: /close sidebar/i }));
      expect(screen.getByTestId("is-open")).toHaveTextContent("closed");
    });
  });

  describe("MobileHeader", () => {
    it("renders the title", () => {
      render(
        <SidebarProvider>
          <MobileHeader title="Test Title" />
        </SidebarProvider>
      );

      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("has menu button", () => {
      render(
        <SidebarProvider>
          <MobileHeader title="Test" />
        </SidebarProvider>
      );

      expect(screen.getByRole("button", { name: /open menu/i })).toBeInTheDocument();
    });

    it("opens sidebar when menu button is clicked", () => {
      render(
        <SidebarProvider>
          <TestSidebarConsumer />
          <MobileHeader title="Test" />
        </SidebarProvider>
      );

      fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
      expect(screen.getByTestId("is-open")).toHaveTextContent("open");
    });

    it("applies sticky class when sticky prop is true", () => {
      const { container } = render(
        <SidebarProvider>
          <MobileHeader title="Test" sticky />
        </SidebarProvider>
      );

      const header = container.querySelector(".sticky");
      expect(header).toBeInTheDocument();
    });

    it("does not apply sticky class by default", () => {
      const { container } = render(
        <SidebarProvider>
          <MobileHeader title="Test" />
        </SidebarProvider>
      );

      const header = container.querySelector(".sticky");
      expect(header).toBeNull();
    });
  });
});

