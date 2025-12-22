import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function DepositsFeature() {
  return (
    <div className="space-y-10 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading1">Investments</h1>
          <h4 className="heading4">
            Track Fixed Deposits and Recurring Deposits
          </h4>
        </div>
      </div>

      {/* Create Deposit Section */}
      <Card>
        <CardHeader>
          <CardTitle>Create Investment</CardTitle>
          <CardDescription>
            Add a new Fixed Deposit or Recurring Deposit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="fd" className="space-y-6">
            <TabsList>
              <TabsTrigger value="fd">Fixed Deposit</TabsTrigger>
              <TabsTrigger value="rd">Recurring Deposit</TabsTrigger>
            </TabsList>

            {/* FD FORM */}
            <TabsContent value="fd" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Deposit Amount</Label>
                  <Input type="number" placeholder="Principal amount" />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Tenure (months)</Label>
                  <Input type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Fixed Deposit</Button>
              </div>
            </TabsContent>

            {/* RD FORM */}
            <TabsContent value="rd" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Monthly Amount</Label>
                  <Input type="number" placeholder="Monthly contribution" />
                </div>
                <div className="space-y-2">
                  <Label>Interest Rate (%)</Label>
                  <Input type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Tenure (months)</Label>
                  <Input type="number" />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Recurring Deposit</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Active / Completed Deposits */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Your Deposits</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Sample FD Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Fixed Deposit</CardTitle>
                <CardDescription>Started on 01 Jan 2024</CardDescription>
              </div>
              <Badge variant="secondary">Active</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount Invested</p>
                  <p className="font-medium">₹1,00,000</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Value</p>
                  <p className="font-medium">₹1,06,400</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Earned</p>
                  <p className="font-medium text-green-600">₹6,400</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Maturity Date</p>
                  <p className="font-medium">01 Jan 2025</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="destructive" size="sm">Cancel</Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample RD Card */}
          <Card className="opacity-80">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recurring Deposit</CardTitle>
                <CardDescription>01 Jan 2023 – 01 Jan 2024</CardDescription>
              </div>
              <Badge variant="outline">Completed</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Amount Invested</p>
                  <p className="font-medium">₹60,000</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Final Value</p>
                  <p className="font-medium">₹63,200</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Interest Earned</p>
                  <p className="font-medium text-green-600">₹3,200</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}