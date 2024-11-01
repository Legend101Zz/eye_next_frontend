/**
 * User Addresses Hook
 * @module application/hooks/user/useAddresses
 *
 * @description
 * Hook for managing user addresses.
 * Handles address CRUD operations and validation.
 *
 * Dependencies:
 * - AddressDto, CreateAddressRequestDto from application layer
 * - UserService from infrastructure layer
 */

import { useState, useCallback, useEffect } from "react";
import { IUserRepository } from "@/domain/ports/repositories/IUserRepository";
import {
  AddressDto,
  CreateAddressRequestDto,
  UpdateAddressRequestDto,
  AddressValidationDto,
} from "@/application/dtos/user/AddressDto";
import { ValidationError, NotFoundError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../auth/useAuth";
import { AddressType } from "@/domain/entities/user.entity";

export interface UseAddressesReturn {
  /** List of user addresses */
  addresses: AddressDto[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Selected address ID */
  selectedAddressId: string | null;
  /** Add new address */
  addAddress: (data: CreateAddressRequestDto) => Promise<boolean>;
  /** Update existing address */
  updateAddress: (
    id: string,
    data: UpdateAddressRequestDto,
  ) => Promise<boolean>;
  /** Delete address */
  deleteAddress: (id: string) => Promise<boolean>;
  /** Set address as default */
  setDefaultAddress: (id: string, type: AddressType) => Promise<boolean>;
  /** Select address */
  selectAddress: (id: string | null) => void;
  /** Validate address */
  validateAddress: (
    address: CreateAddressRequestDto,
  ) => Promise<AddressValidationDto>;
}

/**
 * Hook for managing user addresses
 *
 * @param userService - Instance of IUserService
 * @returns Address management functionality and state
 */
export const useAddresses = (
  userService: IUserRepository,
): UseAddressesReturn => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  // Fetch user addresses
  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await userService.getAddresses(user.id);
      setAddresses(response);
      setError(null);

      // Select default shipping address if none selected
      if (!selectedAddressId) {
        const defaultShipping = response.find(
          (addr) => addr.type === AddressType.SHIPPING && addr.isDefault,
        );
        if (defaultShipping) {
          setSelectedAddressId(defaultShipping.id);
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to load addresses"),
      );
      toast({
        title: "Error",
        description: "Could not load addresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userService, selectedAddressId]);

  // Load addresses on mount and user change
  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Add new address
  const addAddress = useCallback(
    async (data: CreateAddressRequestDto): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        setIsLoading(true);

        // Validate address
        const validation = await userService.validateAddress(data);
        if (!validation.isValid) {
          throw new ValidationError(
            "Invalid address",
            validation.issues?.reduce(
              (acc, issue) => ({
                ...acc,
                [issue.field]: [issue.message],
              }),
              {},
            ),
          );
        }

        const response = await userService.addAddress(user.id, data);
        setAddresses((prev) => [...prev, response]);

        if (data.setAsDefault) {
          setSelectedAddressId(response.id);
        }

        toast({
          title: "Address Added",
          description: "New address has been added successfully",
        });

        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          toast({
            title: "Validation Error",
            description: "Please check your input",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to add address",
            variant: "destructive",
          });
        }
        setError(
          err instanceof Error ? err : new Error("Failed to add address"),
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, userService],
  );

  // Rest of the implementation includes updateAddress, deleteAddress,
  // setDefaultAddress, selectAddress, and validateAddress methods
  // following similar patterns of error handling and state management

  return {
    addresses,
    isLoading,
    error,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    validateAddress,
  };
};
