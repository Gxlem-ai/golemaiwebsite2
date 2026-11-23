import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/Layout";

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="text-center">
        <Eyebrow kind="dot">404</Eyebrow>
        <h1 className="mx-auto mt-6 max-w-[620px] text-balance text-h2 text-ink">That page is not on the record.</h1>
        <p className="mx-auto mt-5 max-w-[440px] text-para text-muted">
          The address may have changed, or it may never have existed. The home page is a good place to start again.
        </p>
        <div className="mt-9">
          <Button href="/" size="lg">
            Back to the home page
          </Button>
        </div>
      </Container>
    </section>
  );
}
