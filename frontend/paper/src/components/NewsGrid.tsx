import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NewsGrid = () => {
  return (
    <section className="grid grid-cols-2 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>More News Headline</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Read More</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Another News Headline</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Read More</Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default NewsGrid;
