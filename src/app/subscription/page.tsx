"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type SubscriptionType = {
  type_id: number;
  subscription_type: string;
  cost: string;
};

type Subscription = {
  sub_id: number;
  user_id: number;
  sub_type: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  subscription_type: SubscriptionType;
  users: {
    user_id: number;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
  };
};

type SubscriptionResponse = {
  subscriptions: Subscription[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
};

const subscriptionTypes: SubscriptionType[] = [
  {
    type_id: 1,
    subscription_type: "family",
    cost: "2000",
  },
  {
    type_id: 2,
    subscription_type: "premium",
    cost: "1500",
  },
  {
    type_id: 3,
    subscription_type: "individual",
    cost: "1000",
  },
];

export default function SubscriptionPage() {
  const [user, setUser] = useState<{ user_id: number } | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionType | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedSubscriptionDetails, setSelectedSubscriptionDetails] =
    useState<Subscription | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user/session");
        if (!response.ok) throw new Error("Failed to fetch session");
        const session = await response.json();
        if (!session.email) throw new Error("No email found in session");

        const res = await fetch(`/api/user?email=${session.email}`);
        if (!res.ok) throw new Error("Failed to fetch user data");

        const userData = await res.json();
        setUser(userData.data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/subscription/${user.user_id}`);
      if (!response.ok) throw new Error("Failed to fetch subscription data");
      const data: SubscriptionResponse = await response.json();
      setSubscriptionData(data);
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      setError("Failed to fetch subscription data");
    }
  };

  const handleSubscriptionSelect = (subscription: SubscriptionType) => {
    setSelectedSubscription(subscription);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedSubscription || !user) return;

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sub_type: selectedSubscription.type_id,
          user_id: user.user_id,
        }),
      });

      if (response.ok) {
        await fetchSubscriptionData();
      } else {
        console.error("Failed to create subscription:", await response.json());
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
    } finally {
      setShowConfirmDialog(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!selectedSubscriptionDetails) return;

    try {
      const response = await fetch(
        `/api/subscription/${selectedSubscriptionDetails.sub_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cancel: true }),
        }
      );

      if (response.ok) {
        await fetchSubscriptionData();
        setSelectedSubscriptionDetails(null);
      } else {
        console.error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
    }
  };

  const handleModifySubscription = async (newTypeId: number) => {
    if (!selectedSubscriptionDetails) return;

    try {
      const response = await fetch(
        `/api/subscription/${selectedSubscriptionDetails.sub_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newTypeId }),
        }
      );

      if (response.ok) {
        await fetchSubscriptionData();
        setSelectedSubscriptionDetails(null);
      } else {
        console.error("Failed to modify subscription");
      }
    } catch (error) {
      console.error("Error modifying subscription:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const activeSubscription = subscriptionData?.subscriptions.find(
    (sub) => sub.status === "active"
  );

  const sortedSubscriptions = subscriptionData?.subscriptions.sort((a, b) => {
    if (a.status === "active" && b.status !== "active") return -1;
    if (a.status !== "active" && b.status === "active") return 1;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Subscription</h1>

      {!activeSubscription ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Choose a Subscription</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionTypes.map((sub) => (
              <Card
                key={sub.type_id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleSubscriptionSelect(sub)}
              >
                <CardHeader>
                  <CardTitle>{sub.subscription_type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">${sub.cost}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Active Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Status:</strong> {activeSubscription.status}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {activeSubscription.subscription_type.subscription_type}
              </p>
              <p>
                <strong>Cost:</strong> $
                {activeSubscription.subscription_type.cost}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(activeSubscription.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(activeSubscription.end_date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <h2 className="text-xl font-semibold mb-4">Subscription History</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSubscriptions?.map((sub) => (
                <TableRow key={sub.sub_id}>
                  <TableCell>
                    {sub.subscription_type.subscription_type}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(sub.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{sub.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => setSelectedSubscriptionDetails(sub)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white text-black">
          <DialogHeader>
            <DialogTitle>Confirm Subscription</DialogTitle>
            <DialogDescription>
              Are you sure you want to subscribe to the{" "}
              {selectedSubscription?.subscription_type} plan for $
              {selectedSubscription?.cost}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSubscription}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {selectedSubscriptionDetails && (
        <Dialog
          open={!!selectedSubscriptionDetails}
          onOpenChange={() => setSelectedSubscriptionDetails(null)}
        >
          <DialogContent className="bg-white text-black">
            <DialogHeader>
              <DialogTitle>Subscription Details</DialogTitle>
            </DialogHeader>
            <div>
              <p>
                <strong>Type:</strong>{" "}
                {
                  selectedSubscriptionDetails.subscription_type
                    .subscription_type
                }
              </p>
              <p>
                <strong>Cost:</strong> $
                {selectedSubscriptionDetails.subscription_type.cost}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(
                  selectedSubscriptionDetails.start_date
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(
                  selectedSubscriptionDetails.end_date
                ).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {selectedSubscriptionDetails.status}
              </p>
            </div>
            {selectedSubscriptionDetails.status === "active" && (
              <DialogFooter>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white text-black">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will cancel your
                        current subscription.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCancelSubscription}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Modify Subscription</Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white text-black">
                    <DialogHeader>
                      <DialogTitle>Modify Subscription</DialogTitle>
                      <DialogDescription>
                        Choose a new subscription type:
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                      {subscriptionTypes.map((type) => (
                        <Button
                          key={type.type_id}
                          onClick={() => handleModifySubscription(type.type_id)}
                        >
                          {type.subscription_type} - ${type.cost}
                        </Button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
