"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface Subscription {
  sub_id: number;
  user_id: number;
  sub_type: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  subscription_type: {
    type_id: number;
    subscription_type: string;
    cost: number;
  };
  users: {
    user_id: number;
    username: string;
    email: string;
  };
}

const AllSubscriptions: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] =
    useState<Subscription | null>(null);
  const [isCreateSubscriptionDialogOpen, setIsCreateSubscriptionDialogOpen] =
    useState(false);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch("/api/subscription");
        if (!response.ok) {
          throw new Error("Failed to fetch subscriptions");
        }
        const data = await response.json();
        setSubscriptions(data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch subscriptions. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleUpdateSubscription = async (
    subId: number,
    updatedData: Partial<Subscription>
  ) => {
    try {
      const response = await fetch(`/api/subscription/${subId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update subscription");
      }

      const updatedSubscription = await response.json();
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.sub_id === subId ? updatedSubscription : sub
        )
      );

      toast({
        title: "Success",
        description: "Subscription updated successfully.",
      });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubscription = async (subId: number) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      try {
        const response = await fetch(`/api/subscription/${subId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete subscription");
        }

        setSubscriptions(subscriptions.filter((sub) => sub.sub_id !== subId));

        toast({
          title: "Success",
          description: "Subscription deleted successfully.",
        });
      } catch (error) {
        console.error("Error deleting subscription:", error);
        toast({
          title: "Error",
          description: "Failed to delete subscription. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateSubscription = async (
    newSubscription: Omit<Subscription, "sub_id" | "created_at">
  ) => {
    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubscription),
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      const createdSubscription = await response.json();
      setSubscriptions([...subscriptions, createdSubscription]);
      setIsCreateSubscriptionDialogOpen(false);

      toast({
        title: "Success",
        description: "Subscription created successfully.",
      });
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Skeleton className="w-[250px] h-[20px] mb-5" />
        <div className="space-y-2">
          <Skeleton className="w-full h-[40px]" />
          <Skeleton className="w-full h-[40px]" />
          <Skeleton className="w-full h-[40px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <Button onClick={() => setIsCreateSubscriptionDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Subscription
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions.map((subscription) => (
            <TableRow key={subscription.sub_id}>
              <TableCell>{subscription.users.username}</TableCell>
              <TableCell>
                {subscription.subscription_type.subscription_type}
              </TableCell>
              <TableCell>
                {new Date(subscription.start_date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(subscription.end_date).toLocaleDateString()}
              </TableCell>
              <TableCell>{subscription.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => setSelectedSubscription(subscription)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Subscription
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        handleDeleteSubscription(subscription.sub_id)
                      }
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Subscription
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedSubscription}
        onOpenChange={() => setSelectedSubscription(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update the details for this subscription
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedSubscription) {
                const formData = new FormData(e.currentTarget);
                const updatedData = {
                  status: formData.get("status") as string,
                  end_date: formData.get("end_date") as string,
                };
                handleUpdateSubscription(
                  selectedSubscription.sub_id,
                  updatedData
                );
                setSelectedSubscription(null);
              }
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Input
                  id="status"
                  name="status"
                  defaultValue={selectedSubscription?.status}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  defaultValue={selectedSubscription?.end_date.split("T")[0]}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isCreateSubscriptionDialogOpen}
        onOpenChange={setIsCreateSubscriptionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Subscription</DialogTitle>
            <DialogDescription>
              Enter the details for the new subscription
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const newSubscription = {
                user_id: Number(formData.get("user_id")),
                sub_type: Number(formData.get("sub_type")),
                start_date: formData.get("start_date") as string,
                end_date: formData.get("end_date") as string,
                status: formData.get("status") as string,
                subscription_type: {
                  type_id: Number(formData.get("sub_type")),
                  subscription_type: "", // Add appropriate value
                  cost: 0, // Add appropriate value
                },
                users: {
                  user_id: Number(formData.get("user_id")),
                  username: "", // Add appropriate value
                  email: "", // Add appropriate value
                },
              };
              handleCreateSubscription(newSubscription);
            }}
          >
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="user_id" className="text-right">
                  User ID
                </Label>
                <Input
                  id="user_id"
                  name="user_id"
                  type="number"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sub_type" className="text-right">
                  Subscription Type
                </Label>
                <Input
                  id="sub_type"
                  name="sub_type"
                  type="number"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="start_date" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end_date" className="text-right">
                  End Date
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Input
                  id="status"
                  name="status"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Subscription</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AllSubscriptions;
