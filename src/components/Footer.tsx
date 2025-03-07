import Container from "@/components/Container";

export default function Footer() {
    return (
        <footer className="mt-6 mb-8 text-center">
            <Container>
                <p className="text-sm">
                    InvoiceZen &copy; {new Date().getFullYear()}
                </p>
            </Container>
        </footer>
    );
}
