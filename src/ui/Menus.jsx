import { createContext, useContext, useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HiEllipsisVertical } from "react-icons/hi2";
import styled from "styled-components";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: fixed;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);
  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();
// eslint-disable-next-line react/prop-types
function Menus({ children }) {
  const [openId, setOpenId] = useState("");
  const close = () => setOpenId("");
  const open = setOpenId;
  return (
    <MenusContext.Provider value={{ openId, close, open }}>
      {children}
    </MenusContext.Provider>
  );
}
// eslint-disable-next-line react/prop-types
function Toggle({ id }) {
  const { openId, close, open } = useContext(MenusContext);
  const toggleButtonRef = useRef(null);

  function handleClick() {
    openId === "" || openId !== id ? open(id) : close();
  }

  return (
    <StyledToggle ref={toggleButtonRef} onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
// eslint-disable-next-line react/prop-types
function List({ id, children }) {
  const { openId } = useContext(MenusContext);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    if (toggleButtonRef.current) {
      const { top, left, height } =
        toggleButtonRef.current.getBoundingClientRect();
      setPosition({ x: left, y: top + height });
    }
  }, [openId]);

  if (openId !== id) return null;

  return createPortal(
    <StyledList position={position}>{children}</StyledList>,
    document.body
  );
}
// eslint-disable-next-line react/prop-types
function Button({ children }) {
  return (
    <li>
      <StyledButton>{children}</StyledButton>
    </li>
  );
}

// eslint-disable-next-line react/prop-types
function Menu({ children }) {
  return <StyledMenu>{children}</StyledMenu>;
}

Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;
Menus.Menu = Menu;

export default Menus;
