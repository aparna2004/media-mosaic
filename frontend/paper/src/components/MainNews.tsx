
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MainNews = () => {
  return (
    <section className="col-span-2">
      <Card>
        <CardHeader>
          <CardTitle>Important Headline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <img src="https://via.placeholder.com/150" alt="News" className="w-full h-auto" />
            <div className="col-span-2 space-y-2">
              <Button variant="outline">News Service 1</Button>
              <Button variant="outline">News Service 2</Button>
              <Button variant="link">More</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default MainNews;