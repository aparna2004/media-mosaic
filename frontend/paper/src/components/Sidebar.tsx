import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  return (
    <aside>
      <Card>
        <CardHeader>
          <CardTitle>Good Morning! Skibideshwar</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fun Fact: Did you know React was released in 2013?</p>
          <Button className="mt-2">Log in for more features</Button>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Weather API</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Fetching data...</p>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;