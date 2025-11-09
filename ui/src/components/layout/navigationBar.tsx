import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { navigationStaticValues } from "@/static-values/navigation-values";
import { Link } from "react-router";

export function NavigationBar() {
    const isMobile = useIsMobile()
    return (<NavigationMenu viewport={isMobile}>
        <NavigationMenuList className="flex-wrap mb-4 mt-2 ml-2">
            <NavigationMenuItem>
                <NavigationMenuTrigger>Home</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                            <NavigationMenuLink asChild>
                                <a
                                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-4 no-underline outline-hidden transition-all duration-200 select-none focus:shadow-md md:p-6"
                                    href="/"
                                >
                                    <div className="mb-2 text-lg font-medium sm:mt-4">
                                        Wealth tracker
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-tight">
                                        Manage your expenses, income, and investments all in one
                                        place.
                                    </p>
                                </a>
                            </NavigationMenuLink>
                        </li>
                        <ListItem to="https://google.com" title="Documentation" _target="_blank">
                            Read how to use wealth tracker to manage your finances effectively.
                        </ListItem>
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
                <NavigationMenuTrigger>Expenses</NavigationMenuTrigger>
                <NavigationMenuContent>
                    <ul className="grid gap-2 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {navigationStaticValues.map((navigationStaticValue) => (
                            <ListItem
                                key={navigationStaticValue.title}
                                title={navigationStaticValue.title}
                                to={navigationStaticValue.to}
                            >
                                {navigationStaticValue.description}
                            </ListItem>
                        ))}
                    </ul>
                </NavigationMenuContent>
            </NavigationMenuItem>
        </NavigationMenuList>
    </NavigationMenu>
    );
}

function ListItem({
    title,
    children,
    to,
    _target,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string, _target?: "_blank" | "_self" | "_parent" | "_top"; }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link to={to} target={_target ? _target : "_self"} rel="noopener noreferrer">
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}