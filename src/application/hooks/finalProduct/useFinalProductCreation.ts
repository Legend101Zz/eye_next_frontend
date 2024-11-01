/**
 * Final Product Creation Hook
 * @module application/hooks/finalProduct/useFinalProductCreation
 *
 * @description
 * Hook for managing the creation process of final products.
 * Provides step-by-step functionality for creating a final product:
 * 1. Base product selection
 * 2. Design application
 * 3. Variant creation
 * 4. Price configuration
 * 5. Final product creation
 *
 * Dependencies:
 * - CreateFinalProductDto from application layer
 * - IFinalProductService, IProductService from domain layer
 * - FinalProduct entities from domain layer
 */

import { useState, useCallback, useEffect } from 'react';
import { IFinalProductService } from '@/domain/ports/services/IFinalProductService';
import { IProductService } from '@/domain/ports/services/IProductService';
import {
  CreateFinalProductDto,
  CreateFinalProductRequestDto,
  DesignApplicationDto,
  ProductVariantDto,
  PriceConfigurationDto,
  ProductionDetailsDto
} from '@/application/dtos/finalProduct';
import {
  FinalProductStatus,
  DesignPosition,
  ProductionMethod
} from '@/domain/entities/finalProduct.entity';
import { ValidationError } from '@/domain/common/errors';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '../auth/useAuth';

export interface CreateVariantOptions {
  color: string;
  sizes: string[];
  price?: number;
}

export interface CreationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface UseFinalProductCreationReturn {
  /** Creation steps */
  steps: CreationStep[];
  /** Current active step */
  currentStep: string;
  /** Selected base product */
  baseProduct: ProductVariantDto | null;
  /** Applied designs */
  appliedDesigns: DesignApplicationDto[];
  /** Price configuration */
  priceConfig: PriceConfigurationDto | null;
  /** Production details */
  productionDetails: ProductionDetailsDto | null;
  /** Creation progress (0-100) */
  progress: number;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Select base product */
  selectBaseProduct: (productId: string, variant?: string) => Promise<boolean>;
  /** Apply design to position */
  applyDesign: (designId: string, position: DesignPosition, transform?: DesignTransform) => Promise<boolean>;
  /** Remove applied design */
  removeDesign: (position: DesignPosition) => void;
  /** Update design transform */
  updateDesignTransform: (position: DesignPosition, transform: DesignTransform) => void;
  /** Configure pricing */
  configurePricing: (config: PriceConfigurationDto) => Promise<boolean>;
  /** Set production details */
  setProductionDetails: (details: ProductionDetailsDto) => Promise<boolean>;
  /** Create variants */
  createVariants: (options: CreateVariantOptions[]) => Promise<boolean>;
  /** Go to step */
  goToStep: (stepId: string) => void;
  /** Validate current step */
  validateStep: () => Promise<boolean>;
  /** Create final product */
  createFinalProduct: () => Promise<string | null>;
  /** Save as draft */
  saveAsDraft: () => Promise<string | null>;
  /** Reset creation state */
  reset: () => void;
}

interface DesignTransform {
  scale?: number;
  rotation?: number;
  position?: {
    x: number;
    y: number;
  };
}

const CREATION_STEPS: CreationStep[] = [
  {
    id: 'product-selection',
    title: 'Select Base Product',
    description: 'Choose the product type and base variant',
    isComplete: false,
    isActive: true
  },
  {
    id: 'design-application',
    title: 'Apply Designs',
    description: 'Add and position your designs',
    isComplete: false,
    isActive: false
  },
  {
    id: 'variant-creation',
    title: 'Create Variants',
    description: 'Configure product variants and options',
    isComplete: false,
    isActive: false
  },
  {
    id: 'price-configuration',
    title: 'Configure Pricing',
    description: 'Set prices and profit margins',
    isComplete: false,
    isActive: false
  },
  {
    id: 'production-setup',
    title: 'Production Setup',
    description: 'Configure production settings',
    isComplete: false,
    isActive: false
  }
];

/**
 * Hook for managing final product creation
 */
export const useFinalProductCreation = (
  finalProductService: IFinalProductService,
  productService: IProductService
): UseFinalProductCreationReturn => {
  const { user } = useAuth();
  const [steps, setSteps] = useState<CreationStep[]>(CREATION_STEPS);
  const [currentStep, setCurrentStep] = useState<string>('product-selection');
  const [baseProduct, setBaseProduct] = useState<ProductVariantDto | null>(null);
  const [appliedDesigns, setAppliedDesigns] = useState<DesignApplicationDto[]>([]);
  const [priceConfig, setPriceConfig] = useState<PriceConfigurationDto | null>(null);
  const [productionDetails, setProductionDetails] = useState<ProductionDetailsDto | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Update progress based on completed steps
  useEffect(() => {
    const completedSteps = steps.filter(step => step.isComplete).length;
    const newProgress = Math.round((completedSteps / steps.length) * 100);
    setProgress(newProgress);
  }, [steps]);

  // Step navigation handler
  const goToStep = useCallback((stepId: string) => {
    setSteps(prevSteps =>
      prevSteps.map(step => ({
        ...step,
        isActive: step.id === stepId
      }))
    );
    setCurrentStep(stepId);
  }, []);

  // Step validation handler
  const validateStep = useCallback(async (): Promise<boolean> => {
    try {
      switch (currentStep) {
        case 'product-selection':
          if (!baseProduct) {
            throw new Error('Please select a base product');
          }
          break;

        case 'design-application':
          if (appliedDesigns.length === 0) {
            throw new Error('Please apply at least one design');
          }
          // Validate design positions and transformations
          for (const design of appliedDesigns) {
            if (!design.position) {
              throw new Error('All designs must have a position');
            }
          }
          break;

        case 'variant-creation':
          // Variant validation will be handled by createVariants function
          break;

        case 'price-configuration':
          if (!priceConfig) {
            throw new Error('Please configure pricing');
          }
          if (priceConfig.basePrice <= 0) {
            throw new Error('Base price must be greater than 0');
          }
          break;

        case 'production-setup':
          if (!productionDetails) {
            throw new Error('Please configure production details');
          }
          if (!productionDetails.method) {
            throw new Error('Production method is required');
          }
          break;
      }

      // Mark current step as complete
      setSteps(prevSteps =>
        prevSteps.map(step =>
          step.id === currentStep
            ? { ...step, isComplete: true }
            : step
        )
      );

      return true;
    } catch (err) {
      toast({
        title: 'Validation Error',
        description: err instanceof Error ? err.message : 'Validation failed',
        variant: 'destructive'
      });
      return false;
    }
  }, [currentStep, baseProduct, appliedDesigns, priceConfig, productionDetails]);

  // Base product selection handler
  const selectBaseProduct = useCallback(async (
    productId: string,
    variant?: string
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const product = await productService.findById(productId);

      if (variant) {
        const selectedVariant = product.variants.find(v => v.id === variant);
        if (!selectedVariant) {
          throw new Error('Selected variant not found');
        }
        setBaseProduct(selectedVariant);
      } else {
        setBaseProduct(product.variants[0]);
      }

      // Mark step as complete and move to next
      await validateStep();
      goToStep('design-application');

      toast({
        title: 'Product Selected',
        description: `Selected ${product.name}`
      });

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to select product');
      setError(error);
      toast({
        title: 'Selection Failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [productService, validateStep, goToStep]);

  // Design application handler
  const applyDesign = useCallback(async (
    designId: string,
    position: DesignPosition,
    transform?: DesignTransform
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!baseProduct) {
        throw new Error('Please select a base product first');
      }

      // Check if position is already occupied
      if (appliedDesigns.some(d => d.position === position)) {
        const confirmed = window.confirm(
          'This position already has a design. Do you want to replace it?'
        );
        if (!confirmed) return false;

        // Remove existing design at position
        setAppliedDesigns(prev =>
          prev.filter(d => d.position !== position)
        );
      }

      // Add new design
      const newDesign: DesignApplicationDto = {
        designId,
        position,
        scale: transform?.scale ?? 1,
        rotation: transform?.rotation ?? 0,
        position: transform?.position ?? { x: 0, y: 0 }
      };

      setAppliedDesigns(prev => [...prev, newDesign]);

      toast({
        title: 'Design Applied',
        description: `Design applied to ${position} position`
      });

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to apply design');
      setError(error);
      toast({
        title: 'Application Failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [baseProduct]);

  // Remove design handler
  const removeDesign = useCallback((position: DesignPosition) => {
    setAppliedDesigns(prev =>
      prev.filter(d => d.position !== position)
    );

    toast({
      title: 'Design Removed',
      description: `Removed design from ${position} position`
    });
  }, []);

  // Update design transform handler
  const updateDesignTransform = useCallback((
    position: DesignPosition,
    transform: DesignTransform
  ) => {
    setAppliedDesigns(prev =>
      prev.map(design =>
        design.position === position
          ? {
              ...design,
              scale: transform.scale ?? design.scale,
              rotation: transform.rotation ?? design.rotation,
              position: transform.position ?? design.position
            }
          : design
      )
    );
  }, []);

  // Price configuration handler
  const configurePricing = useCallback(async (
    config: PriceConfigurationDto
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate pricing configuration
      if (config.basePrice <= 0) {
        throw new Error('Base price must be greater than 0');
      }

      if (config.profit && config.profit < 0) {
        throw new Error('Profit margin cannot be negative');
      }

      setPriceConfig(config);
      await validateStep();
      goToStep('production-setup');

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to configure pricing');
      setError(error);
      toast({
        title: 'Configuration Failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateStep, goToStep]);

  // Production details handler
  const setProductionDetails = useCallback(async (
    details: ProductionDetailsDto
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate production details
      if (!details.method) {
        throw new Error('Production method is required');
      }

      if (!Object.values(ProductionMethod).includes(details.method)) {
        throw new Error('Invalid production method');
      }

      setProductionDetails(details);
      await validateStep();

      return true;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to set production details');
      setError(error);
      toast({
        title: 'Configuration Failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [validateStep]);

  // Create final product handler
  const createFinalProduct = useCallback(async (): Promise<string | null> => {
    if (!user?.isDesigner) {
      toast({
        title: 'Unauthorized',
        description: 'Only designers can create products',
        variant: 'destructive'
      });
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Validate all required data
      if (!baseProduct || appliedDesigns.length === 0 || !priceConfig || !productionDetails) {
        throw new Error('Missing required information');
      }

      // Create final product request
      const productData: CreateFinalProductRequestDto = {
        baseProductId: baseProduct.id,
        designApplications: appliedDesigns,
        price: {
          basePrice: priceConfig.basePrice,
          profit: priceConfig.profit,
          fees: priceConfig.fees
        },
        production: productionDetails,
        designer: {
          id: user.id,
          royaltyPercentage: 10 // Should come from designer settings
        },
        status: FinalProductStatus.ACTIVE
      };

      const response = await finalProductService.create(productData);

      toast({
        title: 'Product Created',
        description: 'Your product has been created successfully'
      });

      return response.id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create product');
      setError(error);
      toast({
        title: 'Creation Failed',
        description: error.message,
      })
    }
  }
