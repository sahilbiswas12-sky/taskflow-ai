import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test(
  "homepage has no serious accessibility violations",
  async ({ page }) => {
    /*
      Tell the website that the user prefers
      reduced motion.
    */
    await page.emulateMedia({
      reducedMotion: "reduce",
    });

    await page.goto("./");

    await page.waitForLoadState(
      "networkidle"
    );

    /*
      Wait until all CSS / Web Animations
      have reached their final state before
      Axe measures colors and contrast.
    */
    await page.evaluate(async () => {
      const animations =
        document.getAnimations();

      await Promise.all(
        animations.map((animation) =>
          animation.finished.catch(
            () => undefined
          )
        )
      );
    });

    /*
      Give the browser one render frame
      after animations finish.
    */
    await page.evaluate(
      () =>
        new Promise((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(
              resolve
            );
          });
        })
    );

    const results =
      await new AxeBuilder({
        page,
      })
        .withTags([
          "wcag2a",
          "wcag2aa",
          "wcag21a",
          "wcag21aa",
        ])
        .analyze();

    const seriousViolations =
      results.violations.filter(
        (violation) =>
          violation.impact ===
            "serious" ||
          violation.impact ===
            "critical"
      );

    /*
      Print a short useful report
      instead of hundreds of lines.
    */
    if (
      seriousViolations.length > 0
    ) {
      console.log(
        "\nACCESSIBILITY ISSUES:\n"
      );

      for (
        const violation
        of seriousViolations
      ) {
        console.log(
          `Rule: ${violation.id}`
        );

        console.log(
          `Impact: ${violation.impact}`
        );

        console.log(
          `Problem: ${violation.help}`
        );

        for (
          const node
          of violation.nodes
        ) {
          console.log(
            `Element: ${node.target.join(
              " "
            )}`
          );

          console.log(
            `Details: ${node.failureSummary}`
          );
        }

        console.log(
          "-------------------------"
        );
      }
    }

    expect(
      seriousViolations
    ).toEqual([]);
  }
);