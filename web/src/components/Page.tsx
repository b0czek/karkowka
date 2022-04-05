import { Container, Row } from "react-bootstrap";

export const Page = (props: PageProps) => (
    <Container>
        <Row className={`d-flex align-items-center justify-content-center ${props.className ?? ""}`}>{props.children}</Row>
    </Container>
);

export interface PageProps {
    className?: string;
    children?: JSX.Element | JSX.Element[] | string;
}
