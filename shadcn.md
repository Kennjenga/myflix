# Create Project

Run the init command to create a new Next.js project or to setup an existing one:

```bash
npx shadcn@latest init
```

You can use the `-d` flag for defaults i.e new-york, zinc and yes for the css variables.

```bash
npx shadcn@latest init -d
```

## Configure `components.json`

You will be asked a few questions to configure `components.json`:

- Which style would you like to use? › New York
- Which color would you like to use as base color? › Zinc
- Do you want to use CSS variables for colors? › no / yes

## That's it

You can now start adding components to your project.

```bash
npx shadcn@latest add button
```

The command above will add the Button component to your project. You can then import it like this:

```javascript
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  );
}
```

For more information, refer to the [Next.js Docs](https://ui.shadcn.com/docs/).
