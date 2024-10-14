import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, CreditCard, Package, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  user_id: number;
  username: string;
  phone_number: string;
  firstname: string;
  lastname: string;
  name: string;
  email: string;
  role: string;
}

interface Subscription {
  sub_id: number;
  user_id: number;
  sub_type: number;
  start_date: Date;
  end_date: Date;
  status: string;
  created_at: Date;
  subscription_type: {
    type_id: number;
    subscription_type: string;
    cost: number;
  };
  users: User;
}

interface SubscriptionProps {
  user: User;
}

const Subscription: React.FC<SubscriptionProps> = ({ user }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(`/api/subscription/${user.user_id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSubscriptions(data.subscriptions);
      } catch (err) {
        setError("Failed to fetch subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [user.user_id]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500";
      case "expired":
        return "bg-red-500";
      case "pending":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-[125px] w-full" />
        <Skeleton className="h-[125px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subscription = subscriptions[0];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Subscriptions</h1>
      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You don&apos;t have any active subscriptions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card key={subscription.sub_id} className="w-full">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">
                  {subscription.subscription_type.subscription_type}
                </CardTitle>
                <Badge
                  className={`${getStatusColor(
                    subscription.status
                  )} text-white`}
                >
                  {subscription.status}
                </Badge>
              </div>
              <CardDescription>
                Subscription ID: {subscription.sub_id}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {formatDate(subscription.start_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {formatDate(subscription.end_date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-medium">
                      ${Number(subscription.subscription_type.cost).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type ID</p>
                    <p className="font-medium">
                      {subscription.subscription_type.type_id}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscription Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground"
                    >
                      No previous subscriptions found.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default Subscription;
